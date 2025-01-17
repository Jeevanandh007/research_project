from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from joblib import load
import numpy as np

app = FastAPI()

# Load the model
model = load('machine_failure_model.joblib')

class MachineData(BaseModel):
    type: int
    air_temp: float  # Air temperature [K]
    process_temp: float  # Process temperature [K] 
    rotational_speed: float  # Rotational speed [rpm]
    torque: float  # Torque [Nm]
    tool_wear: float  # Tool wear [min]


@app.post("/predict")
async def predict(data: MachineData):
    try:
        # Convert input to array format expected by model
        features = np.array([[
            data.type,
            data.air_temp,
            data.process_temp,
            data.rotational_speed,
            data.torque,
            data.tool_wear
        ]])
        
        # Make prediction
        prediction = model.predict(features)
        
        return {
            "prediction": int(prediction[0]),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))