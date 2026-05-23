from flask import Flask, request, jsonify  # type: ignore[reportMissingImports]
from flask_cors import CORS  # type: ignore[reportMissingImports]
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model
model = joblib.load('pipeline_cardio.pkl')
try:
    model.named_steps['model'].n_jobs = 1
except Exception:
    pass

try:
    model.set_output(transform='pandas')
except Exception:
    pass

VALIDATION_RULES = {
    'age': (1, 120, 'Usia'),
    'systolic_bp': (70, 250, 'Tekanan darah sistolik'),
    'diastolic_bp': (40, 150, 'Tekanan darah diastolik'),
    'cholesterol': (80, 400, 'Kolesterol total'),
    'blood_sugar': (50, 500, 'Gula darah puasa'),
    'weight': (25, 250, 'Berat badan'),
    'height': (100, 230, 'Tinggi badan'),
}

TRUTHY_VALUES = {'yes', 'ya', 'true', '1', 'kadang', 'sering'}
ACTIVE_VALUES = {'yes', 'ya', 'true', '1', '1-2x seminggu', '3-4x seminggu', 'setiap hari'}

def parse_number(data, field, default=None):
    value = data.get(field, default)
    if value is None or value == '':
        value = default

    try:
        return float(value)
    except (TypeError, ValueError):
        raise ValueError(f'{VALIDATION_RULES[field][2]} harus berupa angka.')

def validate_input(data):
    errors = {}

    required_fields = ['age', 'gender', 'systolic_bp', 'diastolic_bp', 'cholesterol', 'weight', 'height']
    for field in required_fields:
        if field not in data or data.get(field) in [None, '']:
            errors[field] = f'Missing field: {field}'

    numeric_values = {}
    for field, (minimum, maximum, label) in VALIDATION_RULES.items():
        if field == 'blood_sugar' and data.get(field) in [None, '']:
            numeric_values[field] = 90.0
            continue

        if field in errors:
            continue

        try:
            value = parse_number(data, field, 90 if field == 'blood_sugar' else None)
            numeric_values[field] = value
            if value < minimum or value > maximum:
                errors[field] = f'{label} harus berada pada rentang {minimum}-{maximum}.'
        except ValueError as exc:
            errors[field] = str(exc)

    ap_hi = numeric_values.get('systolic_bp')
    ap_lo = numeric_values.get('diastolic_bp')
    if ap_hi is not None and ap_lo is not None and ap_hi <= ap_lo:
        errors['systolic_bp'] = 'Tekanan darah sistolik harus lebih besar dari diastolik.'

    return errors, numeric_values

def is_truthy_lifestyle(value):
    return str(value or '').strip().lower() in TRUTHY_VALUES

def is_active_lifestyle(value):
    return str(value or '').strip().lower() in ACTIVE_VALUES

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json() or {}
        
        # Validasi input
        errors, values = validate_input(data)
        if errors:
            return jsonify({'error': 'Input prediksi tidak valid.', 'errors': errors}), 400

        # Parsing data dasar dari request Laravel
        age_years = values['age']
        age_days = age_years * 365.25
        
        gender_str = str(data.get('gender', '')).lower()
        if 'perempuan' in gender_str or 'female' in gender_str or gender_str == '1':
            gender = 1
        else:
            gender = 2
            
        height = values['height']
        weight = values['weight']
        ap_hi = values['systolic_bp']
        ap_lo = values['diastolic_bp']
        
        chol_val = values['cholesterol']
        if chol_val < 200:
            cholesterol = 1
        elif chol_val <= 239:
            cholesterol = 2
        else:
            cholesterol = 3
            
        gluc_val = values['blood_sugar']
        if gluc_val < 100:
            gluc = 1
        elif gluc_val <= 125:
            gluc = 2
        else:
            gluc = 3
            
        smoke = 1 if is_truthy_lifestyle(data.get('smoking')) else 0
        alco = 1 if is_truthy_lifestyle(data.get('alcohol')) else 0 
        active = 1 if is_active_lifestyle(data.get('exercise')) else 0
        
        # Feature Engineering (menambahkan fitur turunan)
        if ap_hi < 120 and ap_lo < 80:
            bp_category = 1
        elif ap_hi < 130 and ap_lo < 80:
            bp_category = 2
        elif ap_hi < 140 or ap_lo < 90:
            bp_category = 3
        elif ap_hi <= 180 or ap_lo <= 120:
            bp_category = 4
        else:
            bp_category = 5
            
        pulse_pressure = ap_hi - ap_lo
        map_val = (ap_hi + 2 * ap_lo) / 3
        
        bmi = weight / ((height / 100.0) ** 2) if height > 0 else 0
        
        if bmi < 18.5:
            bmi_category = 1
        elif bmi < 25:
            bmi_category = 2
        elif bmi < 30:
            bmi_category = 3
        else:
            bmi_category = 4
            
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
