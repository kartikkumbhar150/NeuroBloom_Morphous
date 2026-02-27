import requests
import json
from groq_client import ask_groq
from pdf_generator import make_pdf
from cloudinary_uploader import upload_pdf
from utils.db import get_connection

def ensure_disabilities_column():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        ALTER TABLE child_assessment_features
        ADD COLUMN IF NOT EXISTS disabilities JSONB DEFAULT '[]'
    """)
    conn.commit()
    conn.close()

def detect_disabilities(data):
    found = []

    # Dyscalculia: prediction label contains dyscalculia or is at-risk
    math_pred = str(data.get("math", {}).get("prediction", "")).lower()
    if "dyscalculia" in math_pred or "at_risk" in math_pred or "at risk" in math_pred:
        found.append("dyscalculia")

    # Dyslexia: reading risk flag
    reading_risk = str(data.get("reading", {}).get("reading_risk", "")).lower()
    if "at risk" in reading_risk or "risk" in reading_risk:
        found.append("dyslexia")

    # Dysgraphia: handwriting diagnosis not normal
    hw_risk = str(data.get("handwriting", {}).get("handwriting_risk", "NORMAL")).upper()
    if hw_risk != "NORMAL":
        found.append("dysgraphia")

    return found

def save_report_url(session_id, url, disabilities=None):
    conn = get_connection()
    cur = conn.cursor()
    if disabilities is not None:
        cur.execute(
            "UPDATE child_assessment_features SET report_url=%s, disabilities=%s WHERE id=%s",
            (url, json.dumps(disabilities), session_id)
        )
    else:
        cur.execute(
            "UPDATE child_assessment_features SET report_url=%s WHERE id=%s",
            (url, session_id)
        )
    conn.commit()
    conn.close()

def run_pipeline(session_id):
    ensure_disabilities_column()

    base = "http://localhost:5000/predict"

    data = {
        "math": requests.post(f"{base}/dyscalculia",json={"session_id":session_id}).json(),
        "reading": requests.post(f"{base}/reading_disability",json={"session_id":session_id}).json(),
        "emotion": requests.post(f"{base}/emotion",json={"session_id":session_id}).json(),
        "hearing": requests.post(f"{base}/test5",json={"session_id":session_id}).json(),
        "cognition": requests.post(f"{base}/test6",json={"session_id":session_id}).json(),
        "handwriting": requests.post(f"{base}/handwriting",json={"session_id":session_id}).json(),
    }

    disabilities = detect_disabilities(data)

    llm_report = ask_groq(data)
    pdf_path = make_pdf(data, llm_report)
    url = upload_pdf(pdf_path)

    save_report_url(session_id, url, disabilities)

    print("📄 Report ready:", url)
    print("🧠 Disabilities detected:", disabilities)
