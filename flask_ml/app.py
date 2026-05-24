from flask import Flask, request, jsonify  # type: ignore[reportMissingImports]
from flask_cors import CORS  # type: ignore[reportMissingImports]
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model
model = joblib.load('pipeline_cardio.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Validasi input
        required_fields = ['age', 'gender', 'systolic_bp', 'diastolic_bp', 'cholesterol', 'heart_rate', 'weight', 'height']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        # Parsing data dasar dari request Laravel
        age_years = float(data.get('age', 0))
        age_days = age_years * 365.25
        
        gender_str = str(data.get('gender', '')).lower()
        if 'perempuan' in gender_str or 'female' in gender_str or gender_str == '1':
            gender = 1
        else:
            gender = 2
            
        height = float(data.get('height', 0))
        weight = float(data.get('weight', 0))
        ap_hi = float(data.get('systolic_bp', 0))
        ap_lo = float(data.get('diastolic_bp', 0))
        
        chol_val = float(data.get('cholesterol', 0))
        if chol_val < 200:
            cholesterol = 1
        elif chol_val <= 239:
            cholesterol = 2
        else:
            cholesterol = 3
            
        gluc_val = float(data.get('blood_sugar', 100))
        if gluc_val < 100:
            gluc = 1
        elif gluc_val <= 125:
            gluc = 2
        else:
            gluc = 3
            
        smoking_value = str(data.get('smoking', '')).lower().strip()

        if smoking_value in ['sering', 'kadang', 'sudah berhenti', 'yes', 'ya', 'true', '1']:
            smoke = 1
        else:
            smoke = 0


        alcohol_value = str(data.get('alcohol', '')).lower().strip()

        if alcohol_value in ['sering', 'kadang', 'yes', 'ya', 'true', '1']:
            alco = 1
        else:
            alco = 0


        exercise_value = str(data.get('exercise', '')).lower().strip()

        if exercise_value in ['setiap hari', '3-4x seminggu', '1-2x seminggu', 'yes', 'ya', 'true', '1']:
            active = 1
        else:
            active = 0
        
        # Feature Engineering (menambahkan fitur turunan)

        # Kategori tekanan darah, disamakan dengan training pd.cut cat.codes
        if ap_hi <= 120:
            bp_category = 0
        elif ap_hi <= 140:
            bp_category = 1
        elif ap_hi <= 180:
            bp_category = 2
        else:
            bp_category = 3

        # Pulse pressure
        pulse_pressure = ap_hi - ap_lo

        # Mean arterial pressure
        map_val = (ap_hi + 2 * ap_lo) / 3

        # BMI
        bmi = weight / ((height / 100.0) ** 2) if height > 0 else 0

        # Kategori BMI, disamakan dengan training cat.codes
        if bmi < 18.5:
            bmi_category = 0
        elif bmi < 25:
            bmi_category = 1
        elif bmi < 30:
            bmi_category = 2
        else:
            bmi_category = 3

        # Risiko gaya hidup
        lifestyle_risk = smoke + alco + (0 if active else 1)

        # 18 Fitur dengan DataFrame
        input_df = pd.DataFrame([{
            'age': age_days,
            'gender': gender,
            'height': height,
            'weight': weight,
            'ap_hi': ap_hi,
            'ap_lo': ap_lo,
            'cholesterol': cholesterol,
            'gluc': gluc,
            'smoke': smoke,
            'alco': alco,
            'active': active,
            'age_years': age_years,
            'bp_category': bp_category,
            'pulse_pressure': pulse_pressure,
            'map': map_val,
            'bmi': bmi,
            'bmi_category': bmi_category,
            'lifestyle_risk': lifestyle_risk
        }])

        # Prediksi
        prediction = model.predict(input_df)[0]
        try:
            risk_score = float(model.predict_proba(input_df)[0][1] * 100)
        except:
            risk_score = 85.0 if prediction == 1 else 15.0

        if prediction == 1:
            risk_level = 'TINGGI'
        else:
            risk_level = 'RENDAH'
            
        return jsonify({
            'success': True,
            'risk_level': risk_level,
            'risk_score': risk_score
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
