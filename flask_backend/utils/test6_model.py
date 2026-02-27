import joblib

model=joblib.load("models/test6_model.pkl")

def predict_test6(features):
    return model.predict([features])[0]
