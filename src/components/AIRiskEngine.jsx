import React from "react";
import {
  Brain,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Cpu,
  ArrowRight,
  Database,
  Eye,
  Satellite,
  Waves,
} from "lucide-react";

const models = [
  {
    icon: "🌊",
    title: "Overtopping",
    algorithm: "LSTM",
    description:
      "Predicts future reservoir water levels using historical water-level, rainfall and inflow data.",
    inputs: ["Water Level", "Rainfall", "Inflow", "Outflow"],
    output: "Predicted Water Level",
    risk: 72,
    confidence: 94,
    status: "Warning",
  },

  {
    icon: "💧",
    title: "Piping / Internal Erosion",
    algorithm: "Isolation Forest",
    description:
      "Detects abnormal seepage, turbidity and piezometer behaviour that may indicate internal erosion.",
    inputs: ["Seepage", "Turbidity", "Piezometer"],
    output: "Anomaly Score",
    risk: 24,
    confidence: 91,
    status: "Normal",
  },

  {
    icon: "🌎",
    title: "Foundation / Earthquake Instability",
    algorithm: "FFT + Isolation Forest",
    description:
      "Analyses vibration frequency and identifies abnormal structural and seismic vibration patterns.",
    inputs: ["Accelerometer", "Vibration", "Frequency"],
    output: "Structural Anomaly",
    risk: 18,
    confidence: 89,
    status: "Normal",
  },

  {
    icon: "🚪",
    title: "Spillway Gate Failure",
    algorithm: "YOLO + Gate Classification",
    description:
      "Uses CCTV imagery to detect spillway gates and classify their operating state.",
    inputs: ["CCTV", "Gate Position", "Movement"],
    output: "Gate State",
    risk: 48,
    confidence: 96,
    status: "Watch",
  },

  {
    icon: "🛰️",
    title: "Landslide",
    algorithm: "InSAR",
    description:
      "Detects ground deformation around the dam using satellite radar interferometry.",
    inputs: ["SAR Data", "Displacement", "Rainfall"],
    output: "Ground Displacement",
    risk: 67,
    confidence: 87,
    status: "Warning",
  },
];

function StatusBadge({ status }) {
  return (
    <div className={`ai-status ${status.toLowerCase()}`}>
      <span></span>
      {status}
    </div>
  );
}

function ModelCard({ model }) {
  return (
    <div className="ai-model-card">

      <div className="ai-card-header">

        <div className="ai-icon">
          {model.icon}
        </div>

        <div className="ai-card-title">
          <h3>{model.title}</h3>

          <div className="algorithm">
            <Cpu size={14} />
            {model.algorithm}
          </div>
        </div>

        <StatusBadge status={model.status} />

      </div>


      <p className="ai-description">
        {model.description}
      </p>


      <div className="ai-metrics">

        <div className="metric-box">

          <div className="metric-label">
            Risk Score
          </div>

          <div className="metric-value">
            {model.risk}%
          </div>

          <div className="progress">
            <div
              className="progress-risk"
              style={{ width: `${model.risk}%` }}
            ></div>
          </div>

        </div>


        <div className="metric-box">

          <div className="metric-label">
            AI Confidence
          </div>

          <div className="metric-value">
            {model.confidence}%
          </div>

          <div className="progress">
            <div
              className="progress-confidence"
              style={{ width: `${model.confidence}%` }}
            ></div>
          </div>

        </div>

      </div>


      <div className="input-section">

        <div className="input-heading">
          <Database size={14} />
          Input Parameters
        </div>

        <div className="input-tags">

          {model.inputs.map((input) => (
            <span key={input}>
              {input}
            </span>
          ))}

        </div>

      </div>


      <div className="model-output">

        <span>
          Model Output
        </span>

        <strong>
          {model.output}
          <ArrowRight size={15} />
        </strong>

      </div>

    </div>
  );
}


export default function AIRiskEngine() {

  return (
    <div className="ai-page">

      {/* HEADER */}

      <div className="ai-header">

        <div>

          <div className="ai-eyebrow">
            <Brain size={15} />
            ARTIFICIAL INTELLIGENCE RISK ENGINE
          </div>

          <h1>
            Dam Failure Prediction Center
          </h1>

          <p>
            Multi-model AI system for early detection of
            hydraulic, structural and geotechnical dam risks.
          </p>

        </div>


        <div className="ai-live">

          <span></span>

          AI ENGINE ONLINE

        </div>

      </div>


      {/* AI PIPELINE */}

      <section className="ai-architecture">

        <div className="architecture-header">

          <div>

            <h2>
              AI Decision Pipeline
            </h2>

            <p>
              Real-time data is processed through
              specialised failure prediction models.
            </p>

          </div>

          <ShieldCheck size={30} />

        </div>


        <div className="pipeline">

          <div className="pipeline-node">

            <Radio />

            <b>
              Data Sources
            </b>

            <small>
              IoT Sensors<br />
              CCTV<br />
              Satellite
            </small>

          </div>


          <ArrowRight className="pipeline-arrow" />


          <div className="pipeline-node active">

            <Brain />

            <b>
              AI Models
            </b>

            <small>
              LSTM<br />
              Isolation Forest<br />
              YOLO<br />
              InSAR
            </small>

          </div>


          <ArrowRight className="pipeline-arrow" />


          <div className="pipeline-node">

            <Activity />

            <b>
              Risk Fusion
            </b>

            <small>
              Risk Score<br />
              Confidence<br />
              Severity
            </small>

          </div>


          <ArrowRight className="pipeline-arrow" />


          <div className="pipeline-node alert-node">

            <AlertTriangle />

            <b>
              Early Warning
            </b>

            <small>
              Alert<br />
              Response<br />
              Evacuation
            </small>

          </div>

        </div>

      </section>


      {/* MODEL SECTION */}

      <div className="section-heading">

        <div>

          <h2>
            Failure Detection Models
          </h2>

          <p>
            Five specialised AI pipelines monitor
            different dam failure mechanisms.
          </p>

        </div>

        <div className="model-count">
          5 MODELS ACTIVE
        </div>

      </div>


      <div className="ai-model-grid">

        {models.map((model) => (

          <ModelCard
            key={model.title}
            model={model}
          />

        ))}

      </div>


      {/* TECHNICAL INTELLIGENCE */}

      <div className="section-heading">

        <div>

          <h2>
            Intelligence Sources
          </h2>

          <p>
            Multiple sensing technologies provide
            complementary evidence.
          </p>

        </div>

      </div>


      <div className="technical-grid">


        <div className="technical-card">

          <Waves />

          <h3>
            Hydrological Intelligence
          </h3>

          <p>
            LSTM-based time-series forecasting
            evaluates reservoir behaviour.
          </p>

          <div className="technical-value">
            <strong>35.2 m</strong>
            <span>forecast level</span>
          </div>

        </div>


        <div className="technical-card">

          <Eye />

          <h3>
            Computer Vision
          </h3>

          <p>
            YOLO-based detection monitors
            spillway gate conditions.
          </p>

          <div className="technical-value">
            <strong>5 / 5</strong>
            <span>gates detected</span>
          </div>

        </div>


        <div className="technical-card">

          <Satellite />

          <h3>
            Satellite Intelligence
          </h3>

          <p>
            InSAR detects ground deformation
            around vulnerable slopes.
          </p>

          <div className="technical-value">
            <strong>12.4 mm</strong>
            <span>displacement</span>
          </div>

        </div>

      </div>

    </div>
  );
}