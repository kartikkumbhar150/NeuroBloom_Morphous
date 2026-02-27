import json
import time
import numpy as np
import cv2
import os

from signal_generator import EEGSimulator
from behavioral_processor import BehavioralProcessor
from metrics_engine import MetricsEngine

def get_gaze_ratio(eye_roi):
    try:
        gray_eye = cv2.cvtColor(eye_roi, cv2.COLOR_BGR2GRAY)
        h, w = gray_eye.shape
        gray_eye = gray_eye[int(h*0.3):, :] 
        gray_eye = cv2.equalizeHist(gray_eye) 
        min_loc = cv2.minMaxLoc(gray_eye)[2]
        return min_loc[0] / w
    except:
        return 0.5

def process_video_logic(video_path):
    print(f"[ENGINE] Starting Deep Feature Analysis: {video_path}")
    
    cap = cv2.VideoCapture(video_path)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    
    eeg_sim = EEGSimulator()
    behavior_proc = BehavioralProcessor()
    
    # State Tracking
    blink_counter = 0
    eyes_closed_frames = 0
    session_logs = [] # Yahan har frame ka detailed metrics store hoga
    frame_count = 0

    try:
        if not cap.isOpened():
            return {"error": "Could not open video file"}

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret: break
            
            frame_count += 1
            if frame_count % 3 != 0: continue # Speed Optimization

            frame = cv2.flip(frame, 1)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # --- 1. VISION METRICS ---
            vision_metrics = {"yaw_velocity": 0, "gaze_deviation": 0, "blink_count": blink_counter}
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            for (x, y, w, h) in faces:
                face_center = x + (w / 2)
                yaw_raw = (face_center - (frame.shape[1]/2)) / (frame.shape[1]/2)
                vision_metrics['yaw_velocity'] = abs(yaw_raw) * 100 

                roi_gray = gray[y:y+h, x:x+w]
                eyes = eye_cascade.detectMultiScale(roi_gray, 1.1, 5)
                
                if len(eyes) == 0:
                    eyes_closed_frames += 1
                else:
                    if eyes_closed_frames > 2: blink_counter += 1
                    eyes_closed_frames = 0
                    gaze_offsets = [abs(get_gaze_ratio(frame[y+ey:y+ey+eh, x+ex:x+ex+ew]) - 0.5) 
                                    for (ex, ey, ew, eh) in eyes if ey < h/2]
                    if gaze_offsets:
                        vision_metrics['gaze_deviation'] = np.mean(gaze_offsets) * 2

            # --- 2. BEHAVIORAL MOCKING (Required for MetricsEngine) ---
            # Hum default behavioral features bhej rahe hain taaki engine crash na ho
            mock_mouse = {'velocity_avg': 0.8, 'jerk_avg': 0.2, 'idle_ratio': 0.1}
            mock_keys = {'flight_time_var': 150, 'error_rate': 0.02, 'dwell_time_avg': 0.1}
            behavior_feats = {**mock_mouse, **mock_keys}
            
            # --- 3. EEG & METRICS CALCULATION ---
            sim_state = "DISTRACTED" if vision_metrics['gaze_deviation'] > 0.5 else "FOCUSED"
            eeg_epoch = eeg_sim.generate_epoch(state=sim_state)
            
            # MetricsEngine se 12 features calculate karna
            frame_report = MetricsEngine.compute_all(eeg_epoch, behavior_feats, vision_metrics)
            session_logs.append(frame_report)

        # --- 4. FINAL AGGREGATION (Returns all 12 features) ---
        if not session_logs:
            return {"error": "No data analyzed"}

        # Sabhi features ka average nikalna
        keys_to_average = session_logs[0].keys()
        final_analysis = {}
        
        for key in keys_to_average:
            avg_val = np.mean([log[key] for log in session_logs])
            final_analysis[key] = round(float(avg_val), 2)

        return final_analysis # Yeh exactly aapka required format return karega

    except Exception as e:
        return {"error": str(e)}
    finally:
        cap.release()