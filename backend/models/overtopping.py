import numpy as np

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Input

from sklearn.preprocessing import MinMaxScaler


# =========================================================
# OVERTOPPING LSTM MODEL
# =========================================================

# Sensor order:
# Water Level, Rainfall, Inflow, Outflow


# ---------------------------------------------------------
# CREATE DEMO HISTORICAL DATA
# ---------------------------------------------------------

def create_training_data():

    np.random.seed(42)

    samples = 500

    water_level = np.random.uniform(30, 36, samples)

    rainfall = np.random.uniform(0, 100, samples)

    inflow = np.random.uniform(500, 1200, samples)

    outflow = np.random.uniform(400, 1000, samples)

    # Create realistic relationship for demo training data
    next_water_level = (
        water_level
        + (inflow - outflow) * 0.001
        + rainfall * 0.005
    )

    data = np.column_stack([
        water_level,
        rainfall,
        inflow,
        outflow
    ])

    return data, next_water_level


# ---------------------------------------------------------
# PREPARE SEQUENCES
# ---------------------------------------------------------

def prepare_data():

    data, target = create_training_data()

    feature_scaler = MinMaxScaler()

    target_scaler = MinMaxScaler()

    scaled_data = feature_scaler.fit_transform(data)

    scaled_target = target_scaler.fit_transform(
        target.reshape(-1, 1)
    )

    sequence_length = 5

    X = []
    y = []

    for i in range(
        sequence_length,
        len(scaled_data)
    ):

        X.append(
            scaled_data[
                i - sequence_length:i
            ]
        )

        y.append(
            scaled_target[i]
        )

    X = np.array(X)

    y = np.array(y)

    return (
        X,
        y,
        feature_scaler,
        target_scaler
    )


# ---------------------------------------------------------
# CREATE MODEL
# ---------------------------------------------------------

def create_model():

    model = Sequential([

        Input(
            shape=(5, 4)
        ),

        LSTM(
            32
        ),

        Dense(
            16,
            activation="relu"
        ),

        Dense(
            1
        )
    ])

    model.compile(
        optimizer="adam",
        loss="mse"
    )

    return model


# ---------------------------------------------------------
# TRAIN MODEL
# ---------------------------------------------------------

def train_model():

    (
        X,
        y,
        feature_scaler,
        target_scaler
    ) = prepare_data()

    model = create_model()

    model.fit(
        X,
        y,
        epochs=15,
        batch_size=32,
        verbose=0
    )

    return (
        model,
        feature_scaler,
        target_scaler
    )


# ---------------------------------------------------------
# TRAIN ONCE
# ---------------------------------------------------------

model, feature_scaler, target_scaler = train_model()


# ---------------------------------------------------------
# PREDICT WATER LEVEL
# ---------------------------------------------------------

def predict_water_level(
    water_level,
    rainfall,
    inflow,
    outflow
):

    current_data = np.array([

        [
            water_level,
            rainfall,
            inflow,
            outflow
        ]

    ])

    scaled_current = feature_scaler.transform(
        current_data
    )

    sequence = np.repeat(
        scaled_current,
        5,
        axis=0
    )

    sequence = sequence.reshape(
        1,
        5,
        4
    )

    prediction_scaled = model.predict(
        sequence,
        verbose=0
    )

    prediction = target_scaler.inverse_transform(
        prediction_scaled
    )

    predicted_level = float(
        prediction[0][0]
    )

    return round(
        predicted_level,
        2
    )


# ---------------------------------------------------------
# RISK CALCULATION
# ---------------------------------------------------------

def calculate_overtopping_risk(
    predicted_level
):

    if predicted_level >= 36.0:

        status = "Critical"
        risk_score = 90

    elif predicted_level >= 35.0:

        status = "Warning"
        risk_score = 72

    elif predicted_level >= 34.0:

        status = "Watch"
        risk_score = 48

    else:

        status = "Normal"
        risk_score = 20

    return {

        "predicted_water_level":
            predicted_level,

        "status":
            status,

        "risk_score":
            risk_score
    }


# ---------------------------------------------------------
# TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    predicted = predict_water_level(
        water_level=34.8,
        rainfall=52,
        inflow=820,
        outflow=610
    )

    result = calculate_overtopping_risk(
        predicted
    )

    print(
        "Overtopping LSTM Prediction:"
    )

    print(result)