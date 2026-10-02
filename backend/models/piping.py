import numpy as np


# =========================================================
# PIPING / INTERNAL EROSION
# PURE PYTHON ISOLATION FOREST
# =========================================================


# ---------------------------------------------------------
# ISOLATION TREE
# ---------------------------------------------------------

class IsolationTree:

    def __init__(self, max_depth=8):

        self.max_depth = max_depth
        self.left = None
        self.right = None
        self.feature = None
        self.split_value = None
        self.size = 0

    def fit(self, X, depth=0):

        self.size = len(X)

        # Stop conditions
        if (
            depth >= self.max_depth
            or len(X) <= 2
            or np.all(X == X[0])
        ):
            return self

        # Select random feature
        self.feature = np.random.randint(
            0,
            X.shape[1]
        )

        feature_values = X[:, self.feature]

        minimum = np.min(feature_values)
        maximum = np.max(feature_values)

        # If all values are identical
        if minimum == maximum:
            return self

        # Random split
        self.split_value = np.random.uniform(
            minimum,
            maximum
        )

        left_data = X[
            X[:, self.feature] < self.split_value
        ]

        right_data = X[
            X[:, self.feature] >= self.split_value
        ]

        # Avoid empty branches
        if len(left_data) == 0 or len(right_data) == 0:
            return self

        self.left = IsolationTree(
            self.max_depth
        )

        self.right = IsolationTree(
            self.max_depth
        )

        self.left.fit(
            left_data,
            depth + 1
        )

        self.right.fit(
            right_data,
            depth + 1
        )

        return self

    def path_length(self, point, depth=0):

        # Leaf node
        if (
            self.left is None
            or self.right is None
        ):

            return depth + self.average_path_length(
                self.size
            )

        if point[self.feature] < self.split_value:

            return self.left.path_length(
                point,
                depth + 1
            )

        return self.right.path_length(
            point,
            depth + 1
        )

    @staticmethod
    def average_path_length(n):

        if n <= 1:
            return 0

        if n == 2:
            return 1

        harmonic = (
            np.log(n - 1)
            + 0.5772156649
        )

        return (
            2 * harmonic
            - (2 * (n - 1) / n)
        )


# ---------------------------------------------------------
# ISOLATION FOREST
# ---------------------------------------------------------

class IsolationForestPure:

    def __init__(
        self,
        number_of_trees=50,
        sample_size=128
    ):

        self.number_of_trees = number_of_trees
        self.sample_size = sample_size
        self.trees = []

    def fit(self, X):

        self.trees = []

        actual_sample_size = min(
            self.sample_size,
            len(X)
        )

        max_depth = int(
            np.ceil(
                np.log2(actual_sample_size)
            )
        )

        for _ in range(
            self.number_of_trees
        ):

            # Random sample
            indices = np.random.choice(
                len(X),
                actual_sample_size,
                replace=False
            )

            sample = X[indices]

            tree = IsolationTree(
                max_depth
            )

            tree.fit(sample)

            self.trees.append(tree)

        return self

    def anomaly_score(self, point):

        if len(self.trees) == 0:
            return 0.5

        path_lengths = []

        for tree in self.trees:

            path = tree.path_length(
                point
            )

            path_lengths.append(path)

        average_path = np.mean(
            path_lengths
        )

        c = IsolationTree.average_path_length(
            self.sample_size
        )

        if c == 0:
            return 0.5

        # Isolation Forest anomaly score
        score = 2 ** (
            -average_path / c
        )

        return float(score)


# ---------------------------------------------------------
# CREATE NORMAL TRAINING DATA
# ---------------------------------------------------------

def create_training_data():

    np.random.seed(42)

    samples = 300

    seepage = np.random.normal(
        1.5,
        0.15,
        samples
    )

    turbidity = np.random.normal(
        12,
        2,
        samples
    )

    piezometer = np.random.normal(
        2.0,
        0.1,
        samples
    )

    data = np.column_stack([
        seepage,
        turbidity,
        piezometer
    ])

    return data


# ---------------------------------------------------------
# TRAIN MODEL
# ---------------------------------------------------------

def train_piping_model():

    data = create_training_data()

    model = IsolationForestPure(
        number_of_trees=50,
        sample_size=128
    )

    model.fit(data)

    return model


# Train once
model = train_piping_model()


# ---------------------------------------------------------
# PIPING ANOMALY DETECTION
# ---------------------------------------------------------

def detect_piping_anomaly(
    seepage,
    turbidity,
    piezometer
):

    sensor_data = np.array([
        seepage,
        turbidity,
        piezometer
    ])

    score = model.anomaly_score(
        sensor_data
    )

    # Higher score = more anomalous
    if score >= 0.65:

        status = "Warning"
        risk_score = 75

    elif score >= 0.55:

        status = "Watch"
        risk_score = 50

    else:

        status = "Normal"
        risk_score = 24

    return {

        "status": status,

        "anomaly_score":
            round(score, 3),

        "risk_score":
            risk_score
    }


# ---------------------------------------------------------
# TEST
# ---------------------------------------------------------

if __name__ == "__main__":

    result = detect_piping_anomaly(
        seepage=1.5,
        turbidity=12,
        piezometer=2.14
    )

    print(
        "Piping / Internal Erosion Prediction:"
    )

    print(result)