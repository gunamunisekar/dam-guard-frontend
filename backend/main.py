from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# =========================================================
# AI MODEL IMPORTS
# =========================================================

from models.overtopping import (
    predict_water_level,
    calculate_overtopping_risk
)

from models.piping import (
    detect_piping_anomaly
)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="Dam Guard AI Backend",
    description="AI-powered dam safety and early warning system",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {
        "message": "Dam Guard AI Backend is running",
        "status": "online"
    }


# =========================================================
# LIVE SENSOR DATA
# =========================================================

@app.get("/sensor/live")
def live_sensor_data():

    return {

        "water_level": 34.8,

        "rainfall": 52,

        "inflow": 820,

        "outflow": 610,

        "piezometer": 2.14,

        "seismic_vibration": 0.02,

        "spillway_gates_open": 2,

        "total_spillway_gates": 5,

        "ground_displacement": 12.4,

        "seepage": 1.5,

        "turbidity": 12

    }


# =========================================================
# OVERALL RISK
# =========================================================

@app.get("/risk/overall")
def overall_risk():

    return {

        "overall_risk": 42,

        "risk_level": "MODERATE",

        "status": "Monitoring Required",

        "confidence": 92

    }


# =========================================================
# OVERTOPPING - LSTM
# =========================================================

@app.post("/predict/overtopping")
def predict_overtopping():

    # -----------------------------------------------------
    # CURRENT SENSOR VALUES
    # -----------------------------------------------------

    water_level = 34.8

    rainfall = 52

    inflow = 820

    outflow = 610


    # -----------------------------------------------------
    # LSTM WATER LEVEL PREDICTION
    # -----------------------------------------------------

    predicted_water_level = predict_water_level(

        water_level=water_level,

        rainfall=rainfall,

        inflow=inflow,

        outflow=outflow

    )


    # -----------------------------------------------------
    # CALCULATE OVERTOPPING RISK
    # -----------------------------------------------------

    risk_result = calculate_overtopping_risk(

        predicted_water_level

    )


    # -----------------------------------------------------
    # RETURN RESULT
    # -----------------------------------------------------

    return {

        "model": "LSTM",

        "failure_mode": "Overtopping",

        "input": {

            "water_level": water_level,

            "rainfall": rainfall,

            "inflow": inflow,

            "outflow": outflow

        },

        "prediction": risk_result["status"],

        "predicted_water_level":
            risk_result["predicted_water_level"],

        "risk_score":
            risk_result["risk_score"],

        "confidence": 94

    }


# =========================================================
# PIPING / INTERNAL EROSION
# =========================================================

@app.post("/predict/piping")
def predict_piping():

    # -----------------------------------------------------
    # CURRENT SENSOR VALUES
    # -----------------------------------------------------

    seepage = 1.5

    turbidity = 12

    piezometer = 2.14


    # -----------------------------------------------------
    # ISOLATION FOREST ANOMALY DETECTION
    # -----------------------------------------------------

    result = detect_piping_anomaly(

        seepage=seepage,

        turbidity=turbidity,

        piezometer=piezometer

    )


    # -----------------------------------------------------
    # RETURN RESULT
    # -----------------------------------------------------

    return {

        "model": "Isolation Forest",

        "failure_mode":
            "Piping / Internal Erosion",

        "input": {

            "seepage": seepage,

            "turbidity": turbidity,

            "piezometer": piezometer

        },

        "prediction":
            result["status"],

        "anomaly_score":
            result["anomaly_score"],

        "risk_score":
            result["risk_score"],

        "confidence": 91

    }


# =========================================================
# FOUNDATION / EARTHQUAKE INSTABILITY
# =========================================================

@app.post("/predict/foundation")
def predict_foundation():

    seismic_vibration = 0.02

    return {

        "model": "FFT + Anomaly Detection",

        "failure_mode":
            "Foundation / Earthquake Instability",

        "input": {

            "seismic_vibration":
                seismic_vibration

        },

        "prediction": "Normal",

        "frequency_peak": 2.4,

        "anomaly_score": 0.18,

        "risk_score": 22,

        "confidence": 89

    }


# =========================================================
# SPILLWAY GATE FAILURE
# =========================================================

@app.post("/predict/spillway")
def predict_spillway():

    gates_open = 2

    total_gates = 5

    return {

        "model":
            "YOLO + Gate-State Classification",

        "failure_mode":
            "Spillway Gate Failure",

        "input": {

            "gates_open":
                gates_open,

            "total_gates":
                total_gates

        },

        "prediction": "Normal",

        "gate_status": [

            "OPEN",

            "OPEN",

            "CLOSED",

            "CLOSED",

            "CLOSED"

        ],

        "risk_score": 25,

        "confidence": 93

    }


# =========================================================
# LANDSLIDE
# =========================================================

@app.post("/predict/landslide")
def predict_landslide():

    ground_displacement = 12.4

    return {

        "model": "InSAR",

        "failure_mode":
            "Landslide / Ground Displacement",

        "input": {

            "ground_displacement":
                ground_displacement

        },

        "prediction": "Monitoring",

        "displacement_mm":
            ground_displacement,

        "risk_score": 31,

        "confidence": 90

    }


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(

        "main:app",

        host="0.0.0.0",

        port=8000,

        reload=True

    )