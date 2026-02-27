🧠 NeuroBloom

Multimodal AI-Based Early Screening System for Learning Difficulties

NeuroBloom is a multimodal AI screening platform designed for the early identification of learning difficulties in children. The system integrates gamified assessments, camera-based behavioral analysis, and EEG brainwave signals to generate a comprehensive neuro-cognitive profile and identify learning risk indicators before academic failure occurs.

✨ Key Features

🎮 Gamified Cognitive Assessments
Six structured game modules covering math, reading, writing, emotions, auditory attention, and visual processing.

🎥 Behavioral Analysis (Computer Vision)
Real-time analysis of attention, engagement, head movement, eye activity, and motor stability using standard cameras.

🧠 EEG Signal Integration
Optional EEG-based analysis using NeuroSky MindWave for deeper insights into attention, cognitive load, and mental fatigue.

🤖 Multimodal AI Fusion
Synchronization and fusion of gameplay, behavioral, and EEG features for accurate learning-risk screening.

📊 Automated Reports
Generates clear reports highlighting strengths, weaknesses, risk levels, and personalized activity recommendations.

🌱 Scalable Two-Stage Model
Hardware-free primary screening with optional EEG-based secondary analysis for high-risk cases.


1. create .env in /flask_backend :
NEON_DB_URL=''
GROQ_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

2. create .env for /neurobloom
JWT_SECRET=
DATABASE_URL=''
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

3. /neurobloom
npm run dev

4. flask_backend
python app.py
python worker.py


