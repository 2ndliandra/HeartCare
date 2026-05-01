import joblib
import pandas as pd

# Load model
model = joblib.load('pipeline_cardio.pkl')

# Cek apakah model menyimpan nama fitur
if hasattr(model, 'feature_names_in_'):
    print("--- URUTAN FITUR YANG BENAR ---")
    for i, name in enumerate(model.feature_names_in_):
        print(f"{i}. {name}")
else:
    print("Model tidak menyimpan nama fitur secara otomatis.")
    # Jika tidak ada, kita bongkar struktur pipeline-nya
    print("\n--- STRUKTUR PIPELINE ---")
    print(model)