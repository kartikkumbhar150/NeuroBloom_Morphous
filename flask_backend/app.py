from flask import Flask, request, jsonify
from utils.fetch import fetch_session
from utils.audio import download_audio
from utils.speech import transcribe
from utils.features_test6 import extract_features as extract_test6_features
from utils.test6_model import predict_test6
import numpy as np
from utils.handwriting import analyze_handwriting
from utils.test5_model import predict_test5
from utils.features_test5 import extract_features as extract_test5
from utils.image import download_image
import requests
from utils.groq_api import send_to_groq
from pdf_generator import create_pdf
from cloudinary_uploader import upload_to_cloudinary
from utils.report_db import save_report_url, ensure_disabilities_column
from utils.video_download import download_video_from_url, cleanup_video
from main import process_video_logic # Ye function aapke main script mein hona chahiye

def detect_disabilities(data):
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

# ================= MODELS =================

# Dyscalculia
from utils.features import extract_features as extract_math_features
from utils.model import predict as predict_math

# Reading (speech)
from utils.features2 import extract_features as extract_reading_features
from utils.model2 import predict as predict_reading

# Emotion
from utils.features3 import extract_features as extract_emotion_features
from utils.model3 import predict as predict_emotion


app = Flask(__name__)

# ---------------- Dyscalculia ----------------
@app.route("/predict/dyscalculia", methods=["POST"])
def run_prediction():
    session_id = request.json.get("session_id")
    row = fetch_session(session_id)

    if not row:
        return jsonify({"error": "Session not found"}), 404

    # Raw answers & times
    q = [0 if x is None else float(x) for x in row[0:6]]
    t = [0 if x is None else float(x) for x in row[6:12]]

    # ML features + prediction
    features = extract_math_features(row)
    result = predict_math(features)

    # ------------------------
    # Question-wise Analysis
    # ------------------------
    questions = [
        "Counting objects",
        "Comparing quantities",
        "Comparing numbers",
        "Addition",
        "Money calculation",
        "Subtraction"
    ]

    strengths = []
    weaknesses = []
    detailed = []

    for i in range(6):
        status = "correct" if q[i] == 1 else "incorrect"
        speed = "fast" if t[i] < np.mean(t) else "slow"

        entry = {
            "skill": questions[i],
            "correct": bool(q[i]),
            "time": t[i],
            "performance": "good" if q[i] == 1 and speed == "fast" else
                           "slow but correct" if q[i] == 1 else
                           "struggled"
        }

        detailed.append(entry)

        # Cognitive meaning
        if q[i] == 1:
            strengths.append(questions[i])
        else:
            weaknesses.append(questions[i])

    # Cognitive style
    if np.mean(t) > 6:
        weaknesses.append("Slow mathematical processing")
    if np.std(t) > 3:
        weaknesses.append("Inconsistent attention during math")

    return jsonify({
        "session_id": session_id,
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "probabilities": result["probabilities"],

        "math_profile": {
            "accuracy": round(np.mean(q), 2),
            "avg_time": round(np.mean(t), 2),
            "consistency": round(np.std(t), 2)
        },

        "question_analysis": detailed,

        "child_strengths": list(set(strengths)),
        "child_struggles": list(set(weaknesses))
    })


# ---------------- Reading Disability ----------------
@app.route("/predict/reading_disability", methods=["POST"])
def reading():
    session_id = request.json.get("session_id")
    row = fetch_session(session_id)

    if not row:
        return jsonify({"error": "Session not found"}), 404

    # audio URLs
    audio1 = row[12]
    audio2 = row[13]

    if not audio1 or not audio2:
        return jsonify({"error": "Missing reading audio"}), 400

    # Download & transcribe
    f1 = download_audio(audio1)
    f2 = download_audio(audio2)

    w1 = transcribe(f1)
    w2 = transcribe(f2)

    # Feature extraction per audio
    ftrs1 = extract_reading_features(w1)
    ftrs2 = extract_reading_features(w2)

    # Combine for ML
    combined = {
        "avg_pause": (ftrs1["avg_pause"] + ftrs2["avg_pause"]) / 2,
        "max_pause": max(ftrs1["max_pause"], ftrs2["max_pause"]),
        "pause_count": ftrs1["pause_count"] + ftrs2["pause_count"],
        "wpm": (ftrs1["wpm"] + ftrs2["wpm"]) / 2,
        "total_words": ftrs1["total_words"] + ftrs2["total_words"]
    }

    # ML prediction
    result = predict_reading(combined)

    # ---------------- Interpretation ----------------
    strengths = []
    weaknesses = []

    # Audio 1 (simple reading)
    if ftrs1["wpm"] < 80:
        weaknesses.append("Slow word decoding")
    else:
        strengths.append("Good basic reading speed")

    if ftrs1["avg_pause"] > 0.6:
        weaknesses.append("Hesitates between words")
    else:
        strengths.append("Smooth word flow")

    # Audio 2 (paragraph reading)
    if ftrs2["pause_count"] > 5:
        weaknesses.append("Poor reading stamina (many long pauses)")
    else:
        strengths.append("Good reading endurance")

    if ftrs2["max_pause"] > 2.5:
        weaknesses.append("Loses place while reading")

    if ftrs2["wpm"] < ftrs1["wpm"] * 0.7:
        weaknesses.append("Fluency drops in longer text (working memory issue)")

    # ---------------- Return ----------------
    return jsonify({
        "session_id": session_id,

        "audio_1_features": ftrs1,
        "audio_2_features": ftrs2,

        "combined_features": combined,

        "reading_risk": result["status"],
        "LD_score": round(result["LD_score"], 4),
        "threshold": result["threshold"],

        "child_strengths": list(set(strengths)),
        "child_struggles": list(set(weaknesses))
    })


# ---------------- Emotion ----------------
@app.route("/predict/emotion", methods=["POST"])
def emotion():
    session_id = request.json.get("session_id")
    row = fetch_session(session_id)

    if not row:
        return jsonify({"error": "Session not found"}), 404

    features = extract_emotion_features(row)
    result = predict_emotion(features)

    q1, q2, q3, q4, t1, t2, t3, t4 = features

    emotions = ["Happiness", "Sadness", "Anger", "Distress"]
    answers = [q1, q2, q3, q4]
    times = [t1, t2, t3, t4]

    strengths = []
    weaknesses = []
    details = []

    avg_time = sum(times) / 4

    for i in range(4):
        emotion = emotions[i]

        if answers[i] == 1:
            strengths.append(f"Recognizes {emotion.lower()}")
        else:
            weaknesses.append(f"Struggles to recognize {emotion.lower()}")

        speed = "slow" if times[i] > avg_time else "normal"

        details.append({
            "emotion": emotion,
            "correct": bool(answers[i]),
            "reaction_time": round(times[i], 2),
            "speed": speed
        })

    # High-level social insight
    if sum(answers) <= 2:
        weaknesses.append("Weak emotional recognition (possible social perception difficulty)")

    if max(times) > 4:
        weaknesses.append("Slow emotional processing")

    return jsonify({
        "session_id": session_id,

        "emotion_prediction": result,

        "question_analysis": details,

        "child_strengths": list(set(strengths)),
        "child_struggles": list(set(weaknesses))
    })

# ---------------- Test 6 : Visual + Memory + Logic ----------------
@app.route("/predict/test6", methods=["POST"])
def test6():
    session_id = request.json.get("session_id")

    row = fetch_session(session_id)
    if not row:
        return jsonify({"error": "Session not found"}), 404

    # Raw scores and times
    scores = [0 if x is None else int(x) for x in row[22:26]]
    times  = [8 if x is None else float(x) for x in row[26:30]]


    # ML features
    features = extract_test6_features(row)

    # ML prediction
    prediction = predict_test6(features)

    strengths = []
    weaknesses = []

    # Memory
    if scores[1] == 1:
        strengths.append("Strong visual working memory (can remember images well)")
    else:
        weaknesses.append("Weak image memory (forgets visual information)")

    # Spatial (mirror)
    if scores[2] == 1:
        strengths.append("Good visual-spatial ability")
    else:
        weaknesses.append("Mirror image confusion (spatial processing weak)")

    # Pattern
    if scores[3] == 1:
        strengths.append("Strong pattern and logical reasoning")
    else:
        weaknesses.append("Difficulty understanding patterns and sequences")

    # Processing speed
    avg_time = np.mean(times)
    if avg_time < 4:
        strengths.append("Fast thinking and response speed")
    else:
        weaknesses.append("Slow cognitive processing")

    # Attention stability
    if np.std(times) > 1.5:
        weaknesses.append("Inconsistent attention during tasks")

    return jsonify({
        "session_id": session_id,
        "test6_scores": {
            "odd_one_out": scores[0],
            "memory": scores[1],
            "mirror": scores[2],
            "pattern": scores[3]
        },
        "test6_times": {
            "odd_one_out": times[0],
            "memory": times[1],
            "mirror": times[2],
            "pattern": times[3]
        },
        "cognitive_prediction": prediction,
        "strengths": strengths,
        "weaknesses": weaknesses
    })

# ---------------- Handwriting Geometry ----------------
from utils.image import download_image

# ---------------- Handwriting Geometry ----------------
@app.route("/predict/handwriting", methods=["POST"])
def handwriting():
    session_id = request.json.get("session_id")
    row = fetch_session(session_id)

    if not row:
        return jsonify({"error": "Session not found"}), 404

    image_url = row[14]
    if not image_url:
        return jsonify({"error": "No handwriting image found"}), 400

    image_bytes = download_image(image_url)
    score, diagnosis = analyze_handwriting(image_bytes)

    strengths = []
    weaknesses = []

    if diagnosis == "NORMAL":
        strengths.append("Good handwriting structure")
        strengths.append("Strong fine motor control")
    elif diagnosis == "MILD IRREGULARITY":
        weaknesses.append("Inconsistent spacing between lines")
        weaknesses.append("Handwriting still developing")
    else:
        weaknesses.append("Poor motor planning while writing")
        weaknesses.append("Possible dysgraphia (writing difficulty)")

    if score > 0.7:
        weaknesses.append("Visual-motor coordination difficulty")

    return jsonify({
        "session_id": session_id,
        "handwriting_risk": diagnosis,
        "risk_score": round(score,3),

        "child_strengths": strengths,
        "child_struggles": weaknesses
    })
# ---------------- Test 5 : Auditory Processing ----------------

@app.route("/predict/test5",methods=["POST"])
def test5():
    sid = request.json["session_id"]
    row = fetch_session(sid)
    feats = extract_test5(row)

    pred = predict_test5(feats)

    mean_rt, var, missed, impulsive, slow, q2t, q2s, q3t, q3s = feats

    strengths=[]
    weaknesses=[]

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
        "prediction": pred,
        "features": {
            "mean_reaction_time": mean_rt,
            "reaction_variability": var,
            "missed_beeps": missed,
            "impulsivity": impulsive,
            "slow_responses": slow
        },
        "strengths": strengths,
        "weaknesses": weaknesses
    })


# ---------------- Vidoe Processing ----------------
@app.route("/predict/video", methods=["POST"])
def predict_video():
    session_id = request.json.get("session_id")
    row = fetch_session(session_id)
    
    if not row or not row[-1]:
        return jsonify({"error": "No link"}), 400

    video_url = row[-1]
    local_path = download_video_from_url(video_url)

    if not local_path:
        return jsonify({"error": "Robust download failed"}), 500

    try:
        report = process_video_logic(local_path)
        return jsonify(report)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Yeh hamesha chalega, chahe success ho ya error
        cleanup_video(local_path)



def run_dyscalculia_internal(session_id):
    with app.test_request_context(json={"session_id": session_id}):
        return run_prediction().get_json()

def run_reading_internal(session_id):
    with app.test_request_context(json={"session_id": session_id}):
        return reading().get_json()

def run_emotion_internal(session_id):
    with app.test_request_context(json={"session_id": session_id}):
        return emotion().get_json()

def run_test5_internal(session_id):
    with app.test_request_context(json={"session_id": session_id}):
        return test5().get_json()

def run_test6_internal(session_id):
    with app.test_request_context(json={"session_id": session_id}):
        return test6().get_json()

def run_handwriting_internal(session_id):
    with app.test_request_context(json={"session_id": session_id}):
        return handwriting().get_json()

"""
@app.route("/predict/full_report", methods=["POST"])
def full_report():
    session_id = request.json.get("session_id")

    return jsonify({
        "session_id": session_id,

        "math": run_dyscalculia_internal(session_id),
        "reading": run_reading_internal(session_id),
        "emotion": run_emotion_internal(session_id),
        "auditory": run_test5_internal(session_id),
        "visual_cognition": run_test6_internal(session_id),
        "handwriting": run_handwriting_internal(session_id)
    })
"""
@app.route("/predict/full_report", methods=["POST"])
def full_report():
    sid = request.json["session_id"]

    math = requests.post("http://localhost:5000/predict/dyscalculia", json={"session_id": sid}).json()
    reading = requests.post("http://localhost:5000/predict/reading_disability", json={"session_id": sid}).json()
    emotion = requests.post("http://localhost:5000/predict/emotion", json={"session_id": sid}).json()
    hearing = requests.post("http://localhost:5000/predict/test5", json={"session_id": sid}).json()
    cognition = requests.post("http://localhost:5000/predict/test6", json={"session_id": sid}).json()
    handwriting = requests.post("http://localhost:5000/predict/handwriting", json={"session_id": sid}).json()

    full_json = {
        "session_id": sid,
        "math": math,
        "reading": reading,
        "emotion": emotion,
        "hearing": hearing,
        "cognition": cognition,
        "handwriting": handwriting
    }

    # Detect disabilities
    ensure_disabilities_column()
    disabilities = detect_disabilities(full_json)

    # Send to Groq
    llm_report = send_to_groq(full_json)

    # Generate PDF
    pdf_path = create_pdf(full_json, llm_report)

    # Upload to Cloudinary
    url = upload_to_cloudinary(pdf_path)

    # Save URL + disabilities in DB
    save_report_url(sid, url, disabilities)

    return {"status":"completed", "report_url": url, "disabilities": disabilities}



if __name__ == "__main__":
    app.run(port=5000, debug=True)
