import sys
import json
import pandas as pd
import numpy as np
import os
from xgboost import XGBClassifier

# ==============================
# 1. SAFE INPUT
# ==============================
try:
    input_data = json.loads(sys.argv[1])
except:
    print(json.dumps({"error": "Invalid JSON input"}))
    sys.exit(1)

input_data.pop("userId", None)

# ==============================
# 2. SAFE CSV LOAD
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(BASE_DIR, "risk_train.csv")

try:
    df = pd.read_csv(data_path)
except:
    print(json.dumps({"error": "CSV missing or path wrong"}))
    sys.exit(1)

# ==============================
# 3. SPLIT DATA
# ==============================
X = df.drop("risk", axis=1)
y = df["risk"]

# ==============================
# 4. CLEAN INPUT (CRITICAL FIX)
# ==============================
user_df = pd.DataFrame([input_data])

# match columns
user_df = user_df.reindex(columns=X.columns)

# convert everything safely
user_df = user_df.replace([np.inf, -np.inf], np.nan)
user_df = user_df.fillna(0)
user_df = user_df.apply(pd.to_numeric, errors='coerce').fillna(0)

# ==============================
# 5. TRAIN MODEL
# ==============================
model = XGBClassifier(
    n_estimators=100,
    max_depth=4,
    eval_metric="mlogloss",
    use_label_encoder=False
)

model.fit(X, y)

# ==============================
# 6. PREDICT SAFELY
# ==============================
try:
    prediction = model.predict(user_df)[0]
    prob = float(np.max(model.predict_proba(user_df)))
except:
    print(json.dumps({"error": "Prediction failed"}))
    sys.exit(1)

# ==============================
# 7. LABELS
# ==============================
risk_map = {
    0: "Low Risk",
    1: "Medium Risk",
    2: "High Risk"
}

# ==============================
# 8. RULE INSIGHTS
# ==============================
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
    recommendations.append("Manage time better")

if study < 3:
    insights.append("Low study hours")
    recommendations.append("Increase study time")

# ==============================
# 9. FINAL OUTPUT
# ==============================
result = {
    "risk_level": risk_map.get(int(prediction), "Unknown"),
    "confidence": round(prob, 4),
    "insights": insights,
    "recommendations": recommendations
}

print(json.dumps(result))
