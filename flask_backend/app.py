"""
app.py - Production-Grade Flask API for Child Learning Disability Assessment
"""
import logging
import os
from functools import wraps

import numpy as np
import requests
from flask import Flask, jsonify, request

from cloudinary_uploader import upload_to_cloudinary
from main import process_video_logic
from pdf_generator import create_pdf
from utils.audio import download_audio
from utils.features import extract_features as extract_math_features
from utils.features2 import extract_features as extract_reading_features
from utils.features3 import extract_features as extract_emotion_features
from utils.features_test6 import extract_features as extract_test6_features
from utils.features_test5 import extract_features as extract_test5
from utils.fetch import fetch_session
from utils.groq_api import send_to_groq
from utils.handwriting import analyze_handwriting
from utils.image import download_image
from utils.model import predict as predict_math
from utils.model2 import predict as predict_reading
from utils.model3 import predict as predict_emotion
from utils.model3 import predict as predict_emotion
from utils.report_db import ensure_disabilities_column, save_report_url
from utils.speech import transcribe
from utils.test5_model import predict_test5
from utils.test6_model import predict_test6
from utils.video_download import cleanup_video, download_video_from_url

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def require_session(f):
    """Decorator: validates session_id and fetches DB row."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        body = request.get_json(silent=True) or {}
        session_id = body.get("session_id")
        if not session_id:
            return jsonify({"error": "session_id is required"}), 400
        row = fetch_session(session_id)
        if not row:
            return jsonify({"error": f"Session '{session_id}' not found"}), 404
        return f(session_id, row, *args, **kwargs)
    return wrapper


def detect_disabilities(data: dict) -> list[str]:
    """Derive detected disabilities from aggregated prediction results."""
    found = []

    math_pred = str(data.get("math", {}).get("prediction", "")).lower()
    if "dyscalculia" in math_pred or "at_risk" in math_pred or "at risk" in math_pred:
        found.append("dyscalculia")

    reading_risk = str(data.get("reading", {}).get("reading_risk", "")).lower()
    if "at risk" in reading_risk or "risk" in reading_risk:
        found.append("dyslexia")

    hw_risk = str(data.get("handwriting", {}).get("handwriting_risk", "NORMAL")).upper()
    if hw_risk != "NORMAL":
        found.append("dysgraphia")

    return found


def _post(endpoint: str, session_id: str) -> dict:
    """Internal helper for sub-module HTTP calls with error handling."""
    try:
        resp = requests.post(
            f"{BASE_URL}/predict/{endpoint}",
            json={"session_id": session_id},
            timeout=120,
        )
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as exc:
        logger.error("Sub-call to %s failed: %s", endpoint, exc)
        return {"error": str(exc)}


# ---------------------------------------------------------------------------
# Dyscalculia
# ---------------------------------------------------------------------------

@app.route("/predict/dyscalculia", methods=["POST"])
@require_session
def run_prediction(session_id, row):
    questions_meta = [
        "Counting objects",
        "Comparing quantities",
        "Comparing numbers",
        "Addition",
        "Money calculation",
        "Subtraction",
    ]

    q = [0.0 if x is None else float(x) for x in row[0:6]]
    t = [0.0 if x is None else float(x) for x in row[6:12]]

    features = extract_math_features(row)
    result = predict_math(features)

    strengths, weaknesses, detailed = [], [], []
    avg_time = float(np.mean(t)) if t else 0.0

    for i, label in enumerate(questions_meta):
        is_correct = q[i] == 1.0
        is_fast = t[i] < avg_time

        if is_correct:
            strengths.append(label)
            performance = "fast and correct" if is_fast else "slow but correct"
        else:
            weaknesses.append(label)
            performance = "struggled"

        detailed.append({
            "skill": label,
            "correct": is_correct,
            "time_sec": round(t[i], 2),
            "performance": performance,
        })

    if avg_time > 6:
        weaknesses.append("Slow mathematical processing")
    if float(np.std(t)) > 3:
        weaknesses.append("Inconsistent attention during math")

    return jsonify({
        "session_id": session_id,
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "probabilities": result["probabilities"],
        "math_profile": {
            "accuracy": round(float(np.mean(q)), 2),
            "avg_time_sec": round(avg_time, 2),
            "consistency_std": round(float(np.std(t)), 2),
        },
        "question_analysis": detailed,
        "child_strengths": sorted(set(strengths)),
        "child_struggles": sorted(set(weaknesses)),
    })


# ---------------------------------------------------------------------------
# Reading Disability
# ---------------------------------------------------------------------------

@app.route("/predict/reading_disability", methods=["POST"])
@require_session
def reading(session_id, row):
    audio1_url = row[12]
    audio2_url = row[13]

    if not audio1_url or not audio2_url:
        return jsonify({"error": "Missing one or both reading audio URLs"}), 400

    f1 = download_audio(audio1_url)
    f2 = download_audio(audio2_url)
    w1 = transcribe(f1)
    w2 = transcribe(f2)

    ftrs1 = extract_reading_features(w1)
    ftrs2 = extract_reading_features(w2)

    combined = {
        "avg_pause": (ftrs1["avg_pause"] + ftrs2["avg_pause"]) / 2,
        "max_pause": max(ftrs1["max_pause"], ftrs2["max_pause"]),
        "pause_count": ftrs1["pause_count"] + ftrs2["pause_count"],
        "wpm": (ftrs1["wpm"] + ftrs2["wpm"]) / 2,
        "total_words": ftrs1["total_words"] + ftrs2["total_words"],
    }

    result = predict_reading(combined)

    strengths, weaknesses = [], []

    if ftrs1["wpm"] < 80:
        weaknesses.append("Slow word decoding")
    else:
        strengths.append("Good basic reading speed")

    if ftrs1["avg_pause"] > 0.6:
        weaknesses.append("Hesitates between words")
    else:
        strengths.append("Smooth word flow")

    if ftrs2["pause_count"] > 5:
        weaknesses.append("Poor reading stamina (many long pauses)")
    else:
        strengths.append("Good reading endurance")

    if ftrs2["max_pause"] > 2.5:
        weaknesses.append("Loses place while reading")

    if ftrs1["wpm"] > 0 and ftrs2["wpm"] < ftrs1["wpm"] * 0.7:
        weaknesses.append("Fluency drops in longer text (working memory issue)")

    return jsonify({
        "session_id": session_id,
        "audio_1_features": ftrs1,
        "audio_2_features": ftrs2,
        "combined_features": combined,
        "reading_risk": result["status"],
        "LD_score": round(result["LD_score"], 4),
        "threshold": result["threshold"],
        "child_strengths": sorted(set(strengths)),
        "child_struggles": sorted(set(weaknesses)),
    })


# ---------------------------------------------------------------------------
# Emotion Recognition
# ---------------------------------------------------------------------------

@app.route("/predict/emotion", methods=["POST"])
@require_session
def emotion(session_id, row):
    features = extract_emotion_features(row)
    result = predict_emotion(features)

    q1, q2, q3, q4, t1, t2, t3, t4 = features
    emotions = ["Happiness", "Sadness", "Anger", "Distress"]
    answers = [q1, q2, q3, q4]
    times = [t1, t2, t3, t4]

    avg_time = sum(times) / 4
    strengths, weaknesses, details = [], [], []

    for i, emo in enumerate(emotions):
        if answers[i] == 1:
            strengths.append(f"Recognizes {emo.lower()}")
        else:
            weaknesses.append(f"Struggles to recognize {emo.lower()}")

        details.append({
            "emotion": emo,
            "correct": bool(answers[i]),
            "reaction_time_sec": round(times[i], 2),
            "speed": "slow" if times[i] > avg_time else "normal",
        })

    if sum(answers) <= 2:
        weaknesses.append("Weak emotional recognition (possible social perception difficulty)")
    if max(times) > 4:
        weaknesses.append("Slow emotional processing")

    return jsonify({
        "session_id": session_id,
        "emotion_prediction": result,
        "question_analysis": details,
        "child_strengths": sorted(set(strengths)),
        "child_struggles": sorted(set(weaknesses)),
    })


# ---------------------------------------------------------------------------
# Test 6: Visual + Memory + Logic
# ---------------------------------------------------------------------------

@app.route("/predict/test6", methods=["POST"])
@require_session
def test6(session_id, row):
    scores = [0 if x is None else int(x) for x in row[22:26]]
    times  = [8.0 if x is None else float(x) for x in row[26:30]]

    features = extract_test6_features(row)
    prediction = predict_test6(features)

    strengths, weaknesses = [], []

    checks = [
        (scores[1] == 1, "Strong visual working memory (can remember images well)", "Weak image memory (forgets visual information)"),
        (scores[2] == 1, "Good visual-spatial ability", "Mirror image confusion (spatial processing weak)"),
        (scores[3] == 1, "Strong pattern and logical reasoning", "Difficulty understanding patterns and sequences"),
    ]
    for cond, strength, weakness in checks:
        (strengths if cond else weaknesses).append(strength if cond else weakness)

    avg_time = float(np.mean(times))
    std_time = float(np.std(times))

    if avg_time < 4:
        strengths.append("Fast thinking and response speed")
    else:
        weaknesses.append("Slow cognitive processing")

    if std_time > 1.5:
        weaknesses.append("Inconsistent attention during tasks")

    return jsonify({
        "session_id": session_id,
        "test6_scores": {
            "odd_one_out": scores[0],
            "memory": scores[1],
            "mirror": scores[2],
            "pattern": scores[3],
        },
        "test6_times": {
            "odd_one_out": times[0],
            "memory": times[1],
            "mirror": times[2],
            "pattern": times[3],
        },
        "cognitive_prediction": prediction,
        "strengths": sorted(set(strengths)),
        "weaknesses": sorted(set(weaknesses)),
    })


# ---------------------------------------------------------------------------
# Handwriting Geometry
# ---------------------------------------------------------------------------

@app.route("/predict/handwriting", methods=["POST"])
@require_session
def handwriting(session_id, row):
    image_url = row[14]
    if not image_url:
        return jsonify({"error": "No handwriting image URL found for this session"}), 400

    image_bytes = download_image(image_url)
    score, diagnosis = analyze_handwriting(image_bytes)

    strengths, weaknesses = [], []

    if diagnosis == "NORMAL":
        strengths += ["Good handwriting structure", "Strong fine motor control"]
    elif diagnosis == "MILD IRREGULARITY":
        weaknesses += [
            "Inconsistent spacing between lines",
            "Handwriting still developing",
        ]
    else:
        weaknesses += [
            "Poor motor planning while writing",
            "Possible dysgraphia (writing difficulty)",
        ]

    if score > 0.7:
        weaknesses.append("Visual-motor coordination difficulty")

    return jsonify({
        "session_id": session_id,
        "handwriting_risk": diagnosis,
        "risk_score": round(float(score), 3),
        "child_strengths": strengths,
        "child_struggles": weaknesses,
    })


# ---------------------------------------------------------------------------
# Test 5: Auditory Processing
# ---------------------------------------------------------------------------

@app.route("/predict/test5", methods=["POST"])
@require_session
def test5(session_id, row):
    feats = extract_test5(row)
    pred = predict_test5(feats)

    mean_rt, var, missed, impulsive, slow, q2t, q2s, q3t, q3s = feats

    strengths, weaknesses = [], []

    if missed > 2:
        weaknesses.append("Poor sustained attention (missed beeps)")
    if impulsive > 2:
        weaknesses.append("High impulsivity (clicked before hearing sound)")
    if slow > 2:
        weaknesses.append("Very slow auditory responses (auditory processing weakness)")
    if q3s == 0:
        weaknesses.append("Poor phoneme discrimination (dyslexia marker)")
    if q2s == 0:
        weaknesses.append("Weak auditory word comprehension")

    if mean_rt < 350:
        strengths.append("Fast auditory reaction")
    if q3s == 1:
        strengths.append("Good sound discrimination")
    if q2s == 1:
        strengths.append("Good spoken word understanding")

    return jsonify({
        "session_id": session_id,
        "prediction": pred,
        "features": {
            "mean_reaction_time_ms": mean_rt,
            "reaction_variability": var,
            "missed_beeps": missed,
            "impulsivity_count": impulsive,
            "slow_responses": slow,
        },
        "child_strengths": sorted(set(strengths)),
        "child_struggles": sorted(set(weaknesses)),
    })


# ---------------------------------------------------------------------------
# Video / Behavioural Analysis
# ---------------------------------------------------------------------------

@app.route("/predict/video", methods=["POST"])
@require_session
def predict_video(session_id, row):
    video_url = row[-1]
    if not video_url:
        return jsonify({"error": "No video URL found for this session"}), 400

    local_path = download_video_from_url(video_url)
    if not local_path:
        return jsonify({"error": "Video download failed"}), 500

    try:
        report = process_video_logic(local_path)
        return jsonify(report)
    except Exception as exc:
        logger.exception("Video processing error for session %s", session_id)
        return jsonify({"error": str(exc)}), 500
    finally:
        cleanup_video(local_path)


# ---------------------------------------------------------------------------
# Full Report
# ---------------------------------------------------------------------------

@app.route("/predict/full_report", methods=["POST"])
def full_report():
    body = request.get_json(silent=True) or {}
    session_id = body.get("session_id")
    if not session_id:
        return jsonify({"error": "session_id is required"}), 400

    logger.info("Full report requested for session: %s", session_id)

    full_json = {
        "session_id": session_id,
        "math":        _post("dyscalculia", session_id),
        "reading":     _post("reading_disability", session_id),
        "emotion":     _post("emotion", session_id),
        "hearing":     _post("test5", session_id),
        "cognition":   _post("test6", session_id),
        "handwriting": _post("handwriting", session_id),
    }

    # Ensure schema is ready
    ensure_disabilities_column()

    disabilities = detect_disabilities(full_json)
    logger.info("Disabilities detected for %s: %s", session_id, disabilities)

    try:
        llm_report = send_to_groq(full_json)
    except Exception as exc:
        logger.error("Groq API error: %s", exc)
        llm_report = "LLM report unavailable."

    try:
        pdf_path = create_pdf(full_json, llm_report)
        url = upload_to_cloudinary(pdf_path)
        save_report_url(session_id, url, disabilities)
    except Exception as exc:
        logger.error("PDF/upload error: %s", exc)
        return jsonify({
            "status": "partial",
            "error": f"Report generation failed: {exc}",
            "disabilities": disabilities,
        }), 500

    logger.info("Report URL saved for session %s: %s", session_id, url)

    return jsonify({
        "status": "completed",
        "report_url": url,
        "disabilities": disabilities,
    })


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


# ---------------------------------------------------------------------------
# Error Handlers
# ---------------------------------------------------------------------------

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "Method not allowed"}), 405


@app.errorhandler(500)
def internal_error(e):
    logger.exception("Unhandled server error")
    return jsonify({"error": "Internal server error"}), 500


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)