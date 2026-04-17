import sys
import json

# =========================
# SAFE INPUT
# =========================
try:
    input_data = json.loads(sys.argv[1])
except Exception:
    print(json.dumps({
        "error": "Invalid JSON input"
    }))
    sys.stdout.flush()
    sys.exit(0)

# =========================
# EXTRACT FEATURES SAFELY
# =========================
attendance = float(input_data.get("attendance", 0))
avg_score = float(input_data.get("avg_score", 0))
missed = float(input_data.get("missed_deadlines", 0))
study = float(input_data.get("study_hours", 0))

# =========================
# HEURISTIC + GREEDY SCORING
# =========================
score = 0

# attendance penalty
if attendance < 60:
    score += (60 - attendance) * 0.4

# performance penalty
if avg_score < 50:
    score += (50 - avg_score) * 0.5

# deadlines penalty
if missed > 3:
    score += (missed - 3) * 8

# study penalty
if study < 3:
    score += (3 - study) * 10

score = max(0, score)

# =========================
# RISK LEVEL
# =========================
if score < 20:
    risk_level = "Low Risk"
elif score < 50:
    risk_level = "Medium Risk"
else:
    risk_level = "High Risk"

# =========================
# CONFIDENCE (heuristic probability)
# =========================
confidence = min(1.0, score / 100)

# =========================
# INSIGHTS & RECOMMENDATIONS
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
# FINAL OUTPUT (STRICT CONTRACT)
# =========================
result = {
    "risk_level": risk_level,
    "confidence": round(confidence, 4),
    "risk_score": round(score, 2),
    "insights": insights,
    "recommendations": recommendations
}

print(json.dumps(result))
sys.stdout.flush()
