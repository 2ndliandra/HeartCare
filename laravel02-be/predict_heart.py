import sys
import json

def calculate_risk(data):
    # Very simple mock logic to simulate an AI model
    age = int(data.get('age', 0))
    bp = int(data.get('bloodPressure', 0))
    chol = int(data.get('cholesterol', 0))
    hr = int(data.get('heartRate', 0))
    history_count = len(data.get('history', []))
    
    # Calculate a score
    score = 0
    if age > 50: score += 2
    if bp > 140: score += 3
    if chol > 240: score += 3
    if hr > 90: score += 1
    if history_count > 2: score += 3
    
    if score >= 8:
        return {"risk": "Tinggi", "message": "Penyakit Jantung Koroner Terdeteksi", "accuracy": 94.8}
    elif score >= 4:
        return {"risk": "Sedang", "message": "Hipertensi Terdeteksi", "accuracy": 92.1}
    else:
        return {"risk": "Rendah", "message": "Normal / Sehat", "accuracy": 96.5}

if __name__ == "__main__":
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        result = calculate_risk(data)
        
        # Output result as JSON
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
