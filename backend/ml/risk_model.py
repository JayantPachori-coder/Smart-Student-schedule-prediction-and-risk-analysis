import sys
import json
import pandas as pd
import numpy as np
import os
from xgboost import XGBClassifier

# =========================
# SAFE INPUT
# =========================
try:
    input_data = json.loads(sys.argv[1])
except Exception as e:
    print(json.dumps({"error": "Invalid JSON input"}))
    sys.exit(1)

input_data.pop("userId", None)

# =========================
# LOAD DATA SAFE
# =========================
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(BASE_DIR, "risk_train.csv")
    df = pd.read_csv(data_path)
except Exception as e:
    print(json.dumps({"error": "CSV load failed"}))
    sys.exit(1)

# =========================
# SPLIT DATA
# =========================
X = df.drop("risk", axis=1)
y = df["risk"]

# =========================
# TRAIN MODEL
# =========================
try:
    model = XGBClassifier(
        n_estimators=100,
        max_depth=4,
        eval_metric="mlogloss"
    )
    model.fit(X, y)
except Exception as e:
    print(json.dumps({"error": "Model training failed"}))
    sys.exit(1)

# =========================
# INPUT ALIGNMENT (CRITICAL FIX)
# =========================
user_df = pd.DataFrame([input_data])

for col in X.columns:
    if col not in user_df.columns:
        user_df[col] = 0

user_df = user_df[X.columns]
user_df = user_df.apply(pd.to_numeric, errors="coerce").fillna(0)

# =========================
# PREDICTION (SAFE)
# =========================
try:
    prediction = int(model.predict(user_df)[0])
    prob = float(np.max(model.predict_proba(user_df)))
except Exception as e:
    print(json.dumps({"error": "Prediction failed"}))
    sys.exit(1)

# =========================
# LABELS
# =========================
risk_map = {
    0: "Low Risk",
    1: "Medium Risk",
    2: "High Risk"
}

# =========================
# INSIGHTS
# =========================
attendance = float(input_data.get("attendance", 0))
avg_score = float(input_data.get("avg_score", 0))
missed = float(input_data.get("missed_deadlines", 0))
study = float(input_data.get("study_hours", 0))

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
# FINAL OUTPUT (VERY IMPORTANT)
# =========================
result = {
    "risk_level": risk_map.get(prediction, "Unknown"),
    "confidence": round(prob, 4),
    "insights": insights,
    "recommendations": recommendations
}

print(json.dumps(result))
sys.stdout.flush()   # 🔥 CRITICAL FIX FOR NODE
