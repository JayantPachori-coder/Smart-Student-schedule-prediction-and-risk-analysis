import sys
import json
import pandas as pd
import numpy as np
import os

# =========================
# SAFE INPUT
# =========================
try:
    input_data = json.loads(sys.argv[1])
except Exception:
    print(json.dumps({"error": "Invalid JSON input"}))
    sys.exit(1)

input_data.pop("userId", None)

# =========================
# LOAD DATA (optional - kept for schema reference only)
# =========================
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(BASE_DIR, "risk_train.csv")
    df = pd.read_csv(data_path)
    feature_cols = df.drop("risk", axis=1).columns
except Exception:
    print(json.dumps({"error": "CSV load failed"}))
    sys.exit(1)

# =========================
# INPUT ALIGNMENT
# =========================
user_df = pd.DataFrame([input_data])

for col in feature_cols:
    if col not in user_df.columns:
        user_df[col] = 0

user_df = user_df[feature_cols]
user_df = user_df.apply(pd.to_numeric, errors="coerce").fillna(0)

row = user_df.iloc[0]

# =========================
# HEURISTIC + GREEDY SCORING MODEL
# =========================
score = 0

attendance = float(row.get("attendance", 0))
avg_score = float(row.get("avg_score", 0))
missed = float(row.get("missed_deadlines", 0))
study = float(row.get("study_hours", 0))

# ---- GREEDY CONTRIBUTIONS ----
# each feature independently adds risk (no training, direct rules)

if attendance < 60:
    score += (60 - attendance) * 0.4   # stronger penalty for low attendance

if avg_score < 50:
    score += (50 - avg_score) * 0.5

if missed > 3:
    score += (missed - 3) * 8

if study < 3:
    score += (3 - study) * 10

# normalize score
score = max(0, score)

# =========================
# RISK LEVEL (RULE THRESHOLDING)
# =========================
if score < 20:
    prediction = 0  # Low
elif score < 50:
    prediction = 1  # Medium
else:
    prediction = 2  # High

risk_map = {
    0: "Low Risk",
    1: "Medium Risk",
    2: "High Risk"
}

# =========================
# "CONFIDENCE" (heuristic probability-like score)
# =========================
confidence = min(1.0, score / 100)  # clamp between 0–1

# =========================
# INSIGHTS + RECOMMENDATIONS (same logic as before)
# =========================
insights = []
recommendations = []

if attendance < 60:
    insights.append("Low attendance")
    recommendations.append("Attend classes regularly")

if avg_score < 50:
    insights.append("Low academic performance")
    recommendations.append("Improve revision")

if missed > 3:
    insights.append("Too many missed deadlines")
    recommendations.append("Improve time management")

if study < 3:
    insights.append("Low study hours")
    recommendations.append("Increase study time")

# =========================
# FINAL OUTPUT
# =========================
result = {
    "risk_level": risk_map.get(prediction, "Unknown"),
    "confidence": round(confidence, 4),
    "risk_score": round(score, 2),
    "insights": insights,
    "recommendations": recommendations
}

print(json.dumps(result))
sys.stdout.flush()
