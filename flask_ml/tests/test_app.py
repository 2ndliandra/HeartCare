import importlib.util
import unittest
from pathlib import Path
from unittest.mock import patch


APP_PATH = Path(__file__).resolve().parents[1] / "app.py"


class FakeModel:
    def __init__(self, prediction=1, probability=0.85, raise_proba=False):
        self.prediction = prediction
        self.probability = probability
        self.raise_proba = raise_proba
        self.last_df = None

    def predict(self, input_df):
        self.last_df = input_df
        return [self.prediction]

    def predict_proba(self, input_df):
        if self.raise_proba:
            raise RuntimeError("predict_proba unavailable")
        return [[1 - self.probability, self.probability]]


class FlaskAppTestCase(unittest.TestCase):
    def setUp(self):
        self.fake_model = FakeModel()
        patcher = patch("joblib.load", return_value=self.fake_model)
        self.addCleanup(patcher.stop)
        patcher.start()

        spec = importlib.util.spec_from_file_location("flask_app", APP_PATH)
        self.module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.module)
        self.client = self.module.app.test_client()

    def test_health_endpoint_returns_ok(self):
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"status": "ok"})

    def test_predict_requires_all_required_fields(self):
        payload = {
            "age": 50,
            "gender": "female",
            "systolic_bp": 120,
            "diastolic_bp": 80,
            "cholesterol": 180,
            "heart_rate": 70,
            "weight": 70,
        }

        response = self.client.post("/predict", json=payload)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field: height"})

    def test_predict_success_maps_fields_and_returns_probability_score(self):
        payload = {
            "age": 45,
            "gender": "perempuan",
            "systolic_bp": 145,
            "diastolic_bp": 95,
            "cholesterol": 250,
            "blood_sugar": 130,
            "heart_rate": 78,
            "weight": 80,
            "height": 170,
            "smoking": "ya",
            "alcohol": "true",
            "exercise": "1",
        }

        response = self.client.post("/predict", json=payload)
        body = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(body["success"])
        self.assertEqual(body["risk_level"], "TINGGI")
        self.assertAlmostEqual(body["risk_score"], 85.0)

        row = self.fake_model.last_df.iloc[0]
        self.assertAlmostEqual(row["age"], 45 * 365.25)
        self.assertEqual(row["gender"], 1)
        self.assertEqual(row["cholesterol"], 3)
        self.assertEqual(row["gluc"], 3)
        self.assertEqual(row["smoke"], 1)
        self.assertEqual(row["alco"], 1)
        self.assertEqual(row["active"], 1)
        self.assertEqual(row["bp_category"], 4)
        self.assertEqual(row["bmi_category"], 3)
        self.assertEqual(row["lifestyle_risk"], 2)

    def test_predict_uses_fallback_score_when_predict_proba_fails(self):
        self.fake_model.prediction = 0
        self.fake_model.raise_proba = True
        payload = {
            "age": 39,
            "gender": "male",
            "systolic_bp": 118,
            "diastolic_bp": 77,
            "cholesterol": 180,
            "heart_rate": 65,
            "weight": 68,
            "height": 172,
        }

        response = self.client.post("/predict", json=payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.get_json(),
            {"success": True, "risk_level": "RENDAH", "risk_score": 15.0},
        )


if __name__ == "__main__":
    unittest.main()
