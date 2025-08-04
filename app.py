from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
import joblib  # For loading the trained model
import numpy as np

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

# Load your trained model
model = joblib.load("model\cmodel.pkl")  # Make sure this file is in the same folder

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()

    try:
        # Extract and convert input features to float
        features = [
            float(data['nitrogen']),
            float(data['phosphorus']),
            float(data['potassium']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall']),
        ]

        # Reshape to 2D array for prediction (1 sample, 7 features)
        prediction = model.predict([features])[0]

        return jsonify(prediction=prediction)

    except Exception as e:
        return jsonify(error=str(e)), 400

@app.route('/')
def serve_react():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
