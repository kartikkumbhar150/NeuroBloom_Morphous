import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()


GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.1-8b-instant"

def send_to_groq(report_json):
    """
    Sends neuro-cognitive JSON to Groq and gets a structured diagnostic response.
    """
    
    prompt = f"""
    You are a Senior Child Neuropsychologist and Developmental Specialist.
    
    TASK: Analyze the provided JSON data from 6 cognitive modules (Math, Reading, Emotion, Memory, Hearing, Handwriting) 
    to create a comprehensive Neuro-Developmental Profile.

    STEP 1: RISK SCREENING
    Evaluate: Dyslexia, Dysgraphia, Dyscalculia, Auditory Processing Disorder (APD), NVLD, ADHD, and ASD.
    For each, provide:
    - Status: Not Detected, Low, Medium, or High Risk.
    - Clinical Finding: Specific data-driven reason for this status.
    - The "Why": A brief explanation of the underlying neurological or cognitive mechanism (e.g., "Difficulty with phonological loop" or "Working memory deficit").

    STEP 2: DETAILED CHILD PROFILE
    - Strengths: Highlight 3-4 areas where the child excels (based on high scores/fast response times).
    - Weaknesses: Identify specific cognitive bottlenecks.
    - Precautions for Parents: List "What to avoid" (e.g., avoiding multi-step verbal instructions if APD risk is high).

    STEP 3: ACTION PLAN & INTERVENTIONS
    - Activities to Overcome: Provide 3-5 gamified or daily activities. Each must include:
        * Activity Name
        * Goal (Which cognitive skill it targets)
        * Instructions (Step-by-step for the child/parent)
    - Recommended Professional Therapies: (e.g., ABA, CBT, OT, Speech Therapy) with a brief justification.

    DATA TO ANALYZE:
    {report_json}

    STRICT JSON OUTPUT FORMAT (Ensure all keys exist):
    {{
      "screenings": [
        {{ 
          "disability": "...", 
          "status": "...", 
          "finding": "...",
          "biological_cause": "Briefly explain the 'why' behind this condition"
        }}
      ],
      "child_profile": {{
        "strengths": [{{ "area": "...", "description": "..." }}],
        "weaknesses": [{{ "area": "...", "description": "..." }}],
        "parental_precautions": ["List of things parents should be mindful of or avoid"]
      }},
      "intervention_plan": {{
        "daily_activities": [
           {{ "name": "...", "goal": "...", "instructions": "..." }}
        ],
        "therapeutic_recommendations": [
           {{ "therapy": "...", "reason": "..." }}
        ]
      }},
      "risk_level_summary": "Overall Clinical Risk Level"
    }}
    
    Final Note: Return ONLY the JSON object. Use professional yet supportive language.
    """

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a professional medical screening assistant that only outputs JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1 # Kam temperature se consistency bani rehti hai
    }

    try:
        response = requests.post(GROQ_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[GROQ ERROR] {e}")
        return None