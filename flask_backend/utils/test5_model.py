import joblib
import os

MODEL_PATH = os.path.join("models", "test5_model.pkl")

_model = None

def get_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model

def predict_test5(features):
    model = get_model()
    return model.predict([features])[0]
