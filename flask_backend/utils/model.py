import joblib

model = joblib.load("models/dysgraphia.pkl")

labels = ["Normal", "Low Risk", "Medium Risk", "High Risk", "Slow Learner"]

def predict(features):
    probs = model.predict_proba([features])[0]
    pred = probs.argmax()

    return {
        "prediction": labels[pred],
        "confidence": round(float(probs[pred]) * 100, 2),
        "probabilities": {
            labels[i]: round(float(probs[i]) * 100, 2)
            for i in range(len(labels))
        }
    }
