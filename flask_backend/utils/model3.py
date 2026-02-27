import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "models", "emotion_model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "models", "label_encoder.pkl")

model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)

def predict(features):
    """
    features = [happy, sad, angry, crying, happy_rt, sad_rt, angry_rt, crying_rt]
    """

    X = np.array(features).reshape(1, -1)

    pred = model.predict(X)[0]
    probs = model.predict_proba(X)[0]

    label = encoder.inverse_transform([pred])[0]
    confidence = float(max(probs)) * 100

    return {
        "result": label,
        "confidence": round(confidence, 2)
    }
