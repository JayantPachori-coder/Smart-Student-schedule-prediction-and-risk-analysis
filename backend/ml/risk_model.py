import sys
import json
import pandas as pd
import numpy as np
from xgboost import XGBClassifier

# ==============================
# 1. SAFE INPUT PARSE
# ==============================
try:
    input_data = json.loads(sys.argv[1])
    input_data.pop("userId", None)
except Exception as e:
    print(json.dumps({"error": "Invalid input"}))
    sys.exit(1)

# ==============================
# 2. LOAD DATASET
# ==============================
try:
    df = pd.read_csv("ml/risk_train.csv")
except Exception as e:
    print(json.dumps({"error": "Dataset not found"}))
    sys.exit(1)

X = df.drop("risk", axis=1)
y = df["risk"]

# ==============================
# 3. TRAIN MODEL (SAFE)
# ==============================
model = XGBClassifier(
    n_estimators=120,
    max_depth=4,
    eval_metric="mlogloss",
    use_label_encoder=False
)

model.fit(X, y)

# ==============================
# 4. PREP INPUT (SAFE ALIGNMENT)
# ==============================
user_df = pd.DataFrame([input_data])

# fix missing columns
for col in X.columns:
    if col not in user_df.columns:
        user_df[col] = 0

user_df = user_df[X.columns]

# ==============================
# 5. PREDICTION
# ==============================
try:
    prediction = int(model.predict(user_df)[0])
    prob = float(np.max(model.predict_proba(user_df)))
except Exception as e:
    print(json.dumps({"error": "Prediction failed"}))
    sys.exit(1)

# ==============================
# 6. LABEL MAP
# ==============================
risk_map = {
    0: "Low Risk",
    1: "Medium Risk",
    2: "High Risk"
}

# ==============================
# 7. SIMPLE INSIGHTS (SAFE)
# ==============================
insights = []
recommendations = []

attendance = input_data.get("attendance", 0)
avg_score = input_data.get("avg_score", 0)
study_hours = input_data.get("study_hours", 0)
missed = input_data.get("missed_deadlines", 0)

if attendance < 60:
    insights.append("Low attendance")
    recommendations.append("Attend classes regularly")

if avg_score < 50:
    insights.append("Low academic performance")
    recommendations.append("Revise subjects")

if study_hours < 3:
    insights.append("Low study hours")
    recommendations.append("Increase study time")

if missed > 3:
    insights.append("Too many missed deadlines")
    recommendations.append("Improve time management")

# ==============================
# 8. FINAL OUTPUT (IMPORTANT)
# ==============================
result = {
    "risk_level": risk_map.get(prediction, "Unknown"),
    "confidence": prob,
    "insights": insights,
    "recommendations": recommendations
}

print(json.dumps(result))
