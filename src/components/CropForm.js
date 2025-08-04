import React, { useState } from "react";

export default function CropForm() {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //Prevents default HTML form submission (which reloads the page).

    // Convert string inputs to float before sending
    const payload = {};
    Object.entries(formData).forEach(([key, value]) => {
      payload[key] = parseFloat(value);
    });

    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setPrediction(result.prediction);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const backgroundStyle = {
    backgroundImage: 'url("/Major-Crops-in-Pakistan-12.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={backgroundStyle}>
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <h1 className="text-center mb-4 text-dark">
          Crop Prediction Input Form
        </h1>

        <form
          className="p-4 border rounded bg-light bg-opacity-75 shadow"
          onSubmit={handleSubmit}
        >
          {[
            { label: "N (Nitrogen)", id: "nitrogen" },
            { label: "P (Phosphorus)", id: "phosphorus" },
            { label: "K (Potassium)", id: "potassium" },
            { label: "Temperature (°C)", id: "temperature" },
            { label: "Humidity (%)", id: "humidity" },
            { label: "pH Level", id: "ph" },
            { label: "Rainfall (mm)", id: "rainfall" },
          ].map((field, i) => (
            <div className="mb-3" key={i}>
              <label htmlFor={field.id} className="form-label text-dark">
                <strong>{field.label}</strong>
              </label>
              <input
                type="number"
                step="any"
                className="form-control"
                id={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="text-center">
            <button type="submit" className="btn btn-primary w-100">
              Predict
            </button>
          </div>
        </form>

        {prediction && (
          <div className="alert alert-success text-center mt-3">
            🌾 Recommended Crop: <strong>{prediction}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
