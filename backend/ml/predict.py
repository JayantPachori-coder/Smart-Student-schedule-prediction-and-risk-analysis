import sys
import json
import warnings

warnings.filterwarnings("ignore")

try:
    subjects_input = json.loads(sys.argv[1])

    TIME_SLOTS = [
        "08:00 - 09:00",
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 01:00",
        "01:00 - 02:00",
        "02:00 - 03:00",
        "03:00 - 04:00"
    ]

    # =========================
    # SCORE
    # =========================
    def score(d, p):
        return d * (1 - p / 100)

    enriched = []
    total = 0

    for s in subjects_input:
        d = float(s.get("difficulty", 1))
        p = float(s.get("performance", 1))

        sc = score(d, p)
        total += sc

        enriched.append({
            "name": s.get("name"),
            "score": sc
        })

    # =========================
    # ALLOCATE 1–2 HOURS ONLY
    # =========================
    allocations = []

    for s in enriched:
        ratio = s["score"] / total if total > 0 else 0

        hours = 2 if ratio > 0.5 else 1

        allocations.append({
            "name": s["name"],
            "predictedHours": hours,
            "blockHours": []   # 🔥 MUST EXIST ALWAYS
        })

    # =========================
    # ASSIGN SLOTS
    # =========================
    i = 0

    for sub in allocations:
        for _ in range(sub["predictedHours"]):

            if i >= len(TIME_SLOTS):
                break

            sub["blockHours"].append({
                "timeBlock": TIME_SLOTS[i],
                "hours": 1
            })

            i += 1

    # =========================
    # FORCE SAFETY (VERY IMPORTANT)
    # =========================
    for sub in allocations:
        if "blockHours" not in sub:
            sub["blockHours"] = []

    sys.stdout.write(json.dumps(allocations))
    sys.stdout.flush()

except Exception as e:
    print("ERROR:", str(e), file=sys.stderr)
    sys.exit(1)