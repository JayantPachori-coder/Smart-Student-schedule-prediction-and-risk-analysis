import sys
import json
import pandas as pd
import numpy as np
import shap
from xgboost import XGBClassifier
import os
# ==============================
# 1. INPUT FROM NODE
# ==============================
input_data = json.loads(sys.argv[1])
input_data.pop("userId", None)

# ==============================
# 2. LOAD DATA
# ==============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
df = pd.read_csv(os.path.join(BASE_DIR, "risk_train.csv"))

X = df.drop("risk", axis=1)
y = df["risk"]

# ==============================
# 3. TRAIN MODEL (DEV ONLY)
# ==============================
model = XGBClassifier(
    n_estimators=150,
    max_depth=4,
    eval_metric="mlogloss"
)

model.fit(X, y)

# ==============================
# 4. PREPARE INPUT
# ==============================
user_df = pd.DataFrame([input_data])
user_df = user_df.reindex(columns=X.columns)

# ==============================
# 5. PREDICTION
# ==============================
prediction = int(model.predict(user_df)[0])
prob = float(np.max(model.predict_proba(user_df)))

# ==============================
# 6. SHAP (FIXED & SAFE)
# ==============================
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(user_df)

feature_names = list(X.columns)

# ---- SAFE SHAP EXTRACTION ----
if isinstance(shap_values, list):
    shap_array = shap_values[prediction][0]
else:
    shap_array = shap_values[0]

# FORCE SAFE FLATTEN
shap_array = np.array(shap_array).reshape(-1)

# SAFE CONVERSION (NO CRASH EVER)
shap_result = {
    feature_names[i]: float(shap_array[i])
    for i in range(len(feature_names))
}

# ==============================
# 7. TOP FACTORS
# ==============================
top_factors = sorted(
    shap_result.items(),
    key=lambda x: abs(x[1]),
    reverse=True
)[:3]

top_factors = [x[0] for x in top_factors]

# ==============================
# 8. LABELS
# ==============================
risk_map = {
    0: "Low Risk",
    1: "Medium Risk",
    2: "High Risk"
}

# ==============================
# 9. RULE INSIGHTS
# ==============================
insights = []
recommendations = []

if input_data.get("attendance", 0) < 60:
    insights.append("Low attendance")
    recommendations.append("Attend classes regularly")

if input_data.get("avg_score", 0) < 50:
    insights.append("Low academic performance")
    recommendations.append("Revise weak subjects")

if input_data.get("missed_deadlines", 0) > 3:
    insights.append("Too many missed deadlines")
    recommendations.append("Improve time management")

if input_data.get("study_hours", 0) < 3:
    insights.append("Low study hours")
    recommendations.append("Increase daily study time")

# ==============================
# 10. OUTPUT
# ==============================
result = {
    "risk_level": risk_map.get(prediction, "Unknown"),
    "confidence": prob,
    "top_factors": top_factors,
    "shap_values": shap_result,
    "insights": insights,
    "recommendations": recommendations
}

print(json.dumps(result))
