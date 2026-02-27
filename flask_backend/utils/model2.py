import torch
import joblib
import numpy as np

class Autoencoder(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = torch.nn.Sequential(
            torch.nn.Linear(5,16), torch.nn.ReLU(),
            torch.nn.Linear(16,8), torch.nn.ReLU(),
            torch.nn.Linear(8,3)
        )
        self.decoder = torch.nn.Sequential(
            torch.nn.Linear(3,8), torch.nn.ReLU(),
            torch.nn.Linear(8,16), torch.nn.ReLU(),
            torch.nn.Linear(16,5)
        )

    def forward(self,x):
        return self.decoder(self.encoder(x))

model = Autoencoder()
model.load_state_dict(torch.load("models/autoencoder.pt"))
model.eval()

scaler = joblib.load("models/scaler.pkl")
THRESHOLD = 0.0778   # from training

def predict(features):
    x = np.array([[ 
        features["avg_pause"],
        features["max_pause"],
        features["pause_count"],
        features["wpm"],
        features["total_words"]
    ]])

    x = scaler.transform(x)
    x = torch.tensor(x, dtype=torch.float32)

    with torch.no_grad():
        recon = model(x)
        error = torch.mean((x - recon)**2).item()

    return {
        "LD_score": error,
        "threshold": THRESHOLD,
        "status": "ABNORMAL" if error > THRESHOLD else "NORMAL"
    }
