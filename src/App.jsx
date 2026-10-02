import React, { useState, useEffect } from "react";

import {
  Activity,
  AlertTriangle,
  Bell,
  Brain,
  ChevronDown,
  Clock3,
  Droplets,
  FileText,
  Gauge,
  Home,
  Map,
  Menu,
  Radio,
  ShieldCheck,
  Siren,
  Users,
  Waves,
  X,
  Zap,
  Navigation,
  Send,
  CheckCircle2,
  CircleAlert,
  Settings,
  UserRound,
  Cpu,
  ArrowRight,
  Database,
  Eye,
  Satellite
} from "lucide-react";


/* =========================================================
   DATA
========================================================= */

const failureModes = [
  {
    name: "Overtopping",
    input: "Water level, spillway capacity",
    threshold: "< 35.5 m",
    value: "34.8 m",
    status: "Warning",
    pct: 72
  },
  {
    name: "Piping / Internal Erosion",
    input: "Turbidity, seepage rate",
    threshold: "< 25 NTU",
    value: "14 NTU",
    status: "Normal",
    pct: 34
  },
  {
    name: "Unstable Basement / Earthquake",
    input: "Accelerometer, seismic vibration",
    threshold: "< 0.15 g",
    value: "0.02 g",
    status: "Normal",
    pct: 18
  },
  {
    name: "Spillway Gate Failure",
    input: "Gate position, gate operation",
    threshold: "All gates responsive",
    value: "2/5 open, OK",
    status: "Watch",
    pct: 58
  },
  {
    name: "Landslide / Rainfall",
    input: "Rainfall, slope movement, turbidity",
    threshold: "< 40 mm/hr",
    value: "52 mm/hr",
    status: "Critical",
    pct: 95
  }
];


const zones = [
  {
    name: "Zone A — Village 1",
    status: "Critical"
  },
  {
    name: "Zone B — Village 2",
    status: "Warning"
  },
  {
    name: "Zone C — Village 3",
    status: "Warning"
  },
  {
    name: "Zone D — Upper basin",
    status: "Watch"
  }
];


const aiModels = [
  {
    id: "overtopping",
    icon: "🌊",
    title: "Overtopping",
    algorithm: "LSTM",
    description:
      "Forecasts future reservoir water levels from historical water level, rainfall, inflow and outflow time-series data to detect overtopping risk early.",
    inputs: [
      "Water Level",
      "Rainfall",
      "Inflow",
      "Outflow"
    ],
    output: "Predicted Water Level",
    risk: 72,
    confidence: 94,
    status: "Warning"
  },

  {
    id: "piping",
    icon: "💧",
    title: "Piping / Internal Erosion",
    algorithm: "Isolation Forest",
    description:
      "Detects abnormal seepage, turbidity and piezometer behaviour that may indicate hidden internal erosion or piping.",
    inputs: [
      "Seepage",
      "Turbidity",
      "Piezometer"
    ],
    output: "Anomaly Score",
    risk: 24,
    confidence: 91,
    status: "Normal"
  },

  {
    id: "foundation",
    icon: "🌎",
    title: "Foundation / Earthquake Instability",
    algorithm: "FFT + Isolation Forest",
    description:
      "Transforms vibration signals into frequency-domain features using FFT and identifies abnormal structural or seismic patterns.",
    inputs: [
      "Accelerometer",
      "Seismic Vibration",
      "Frequency Spectrum"
    ],
    output: "Structural Anomaly",
    risk: 18,
    confidence: 89,
    status: "Normal"
  },

  {
    id: "spillway",
    icon: "🚪",
    title: "Spillway Gate Failure",
    algorithm: "YOLO + Gate-State Classification",
    description:
      "Analyses CCTV frames with YOLO to detect spillway gates and classify their operating state.",
    inputs: [
      "CCTV Frames",
      "Gate Position",
      "Gate Movement"
    ],
    output: "Gate State",
    risk: 48,
    confidence: 96,
    status: "Watch"
  },

  {
    id: "landslide",
    icon: "🏔️",
    title: "Landslide",
    algorithm: "InSAR",
    description:
      "Uses satellite radar interferometry to measure ground deformation and identify progressive slope movement.",
    inputs: [
      "SAR Data",
      "Ground Displacement",
      "Deformation Trend"
    ],
    output: "Ground Displacement",
    risk: 67,
    confidence: 87,
    status: "Warning"
  }
];


/* =========================================================
   STATUS COMPONENTS
========================================================= */

function Status({ children }) {

  return (
    <span
      className={`status ${children
        .toLowerCase()
        .replaceAll(" ", "-")}`}
    >
      <span />
      {children}
    </span>
  );
}


function AIStatus({ status }) {

  return (
    <div
      className={`ai-status ${status
        .toLowerCase()
        .replaceAll(" ", "-")}`}
    >
      <span />
      {status}
    </div>
  );
}


/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  page,
  setPage,
  mobileOpen,
  setMobileOpen
}) {

  const items = [
    ["dashboard", "Dashboard", Home],
    ["risk", "Risk Analysis", Gauge],
    ["ai", "AI Risk Engine", Brain],
    ["flood", "Flood Simulation", Waves],
    ["alerts", "Alerts", Bell],
    ["reports", "Reports", FileText]
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? "open" : ""
        }`}
      >

        <div className="brand">

          <div className="brand-icon">
            <Waves size={19} />
          </div>

          <div>
            <b>Dam Guard</b>
            <small>RescueRise</small>
          </div>

          <button
            className="close-mobile"
            onClick={() =>
              setMobileOpen(false)
            }
          >
            <X size={19} />
          </button>

        </div>


        <div className="authority-pill">

          <ShieldCheck size={15} />

          AUTHORITY

        </div>


        <nav>

          {items.map(
            ([key, label, Icon]) => (

              <button
                key={key}
                className={
                  page === key
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => {

                  setPage(key);

                  setMobileOpen(false);

                }}
              >

                <Icon size={18} />

                {label}

                {key === "alerts" && (
                  <span className="nav-badge">
                    3
                  </span>
                )}

              </button>

            )
          )}

        </nav>


        <div className="sidebar-bottom">

          <div className="live-box">

            <span className="live-dot" />

            System live

            <br />

            <small>
              Auto refresh: 60 sec
            </small>

          </div>


          <button className="nav-item">

            <Settings size={18} />

            Settings

          </button>

        </div>

      </aside>
    </>
  );
}


/* =========================================================
   HEADER
========================================================= */

function Header({ setMobileOpen }) {

  return (

    <header className="topbar">

      <button
        className="menu-btn"
        onClick={() =>
          setMobileOpen(true)
        }
      >

        <Menu size={22} />

      </button>


      <div className="reservoir">

        <Map size={16} />

        Poondi Reservoir

        <ChevronDown size={15} />

      </div>


      <div className="top-actions">

        <span className="updated">

          <Clock3 size={15} />

          Last updated:
          Today, 14:32 IST

        </span>


        <div className="user-chip">

          <UserRound size={15} />

          RS

        </div>

      </div>

    </header>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  title,
  value,
  unit,
  status,
  note
}) {

  return (

    <div className="stat-card">

      <div className="stat-head">

        <span>
          {icon}
        </span>

        <small>
          {title}
        </small>

      </div>


      <div className="stat-value">

        {value}

        <em>
          {unit}
        </em>

      </div>


      <Status>
        {status}
      </Status>


      <div className="mini-line">

        <span
          style={{
            width:
              status === "Warning"
                ? "70%"
                : "42%"
          }}
        />

      </div>


      <small className="muted">
        {note}
      </small>

    </div>
  );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ setPage }) {

  return (

    <div className="page">

      <div className="page-title">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Continuous dam safety monitoring
            and early-warning control center.
          </p>

        </div>


        <button
          className="primary"
          onClick={() =>
            setPage("alerts")
          }
        >

          <Siren size={17} />

          View Alerts

        </button>

      </div>


      <div className="risk-banner">

        <div>

          <div className="eyebrow">

            <span className="pulse" />

            LIVE RISK STATUS

          </div>


          <h2>
            Warning
          </h2>

          <p>
            Rising reservoir level combined
            with elevated rainfall. Continue
            heightened monitoring.
          </p>

        </div>


        <div className="risk-scale">

          <div className="scale-track">

            <i />
            <i />
            <i />
            <i />

          </div>


          <div>

            <span>
              Normal
            </span>

            <span>
              Watch
            </span>

            <span>
              Warning
            </span>

            <span>
              Critical
            </span>

          </div>

        </div>

      </div>


      <div className="stats-grid">

        <StatCard
          icon={<Droplets size={17} />}
          title="Water Level"
          value="34.8"
          unit="m"
          status="Warning"
          note="Full reservoir level: 36.5 m"
        />


        <StatCard
          icon={<Activity size={17} />}
          title="Pressure (Piezometer)"
          value="2.14"
          unit="bar"
          status="Normal"
          note="Baseline 1.9–2.3 bar"
        />


        <StatCard
          icon={<Zap size={17} />}
          title="Accelerometer / Seismic"
          value="0.02"
          unit="g"
          status="Normal"
          note="Trigger threshold: 0.15 g"
        />


        <StatCard
          icon={<Navigation size={17} />}
          title="Spillway Gate Position"
          value="2 / 5"
          unit="open"
          status="Normal"
          note="Last actuation: 06:10 IST"
        />

      </div>


      <div className="content-grid two">

        <section className="card">

          <div className="card-title">

            <h3>
              Manual Inspector Input
            </h3>

            <button className="secondary">
              + Add Manual Data
            </button>

          </div>


          <p className="muted">

            Turbidity, seepage and
            slope-movement readings logged
            during today's physical inspection.

          </p>


          <div className="input-row">

            <div>
              <label>
                Turbidity
              </label>

              <b>
                14 NTU
              </b>
            </div>


            <div>
              <label>
                Seepage
              </label>

              <b>
                Normal
              </b>
            </div>


            <div>
              <label>
                Slope movement
              </label>

              <b>
                0.4 mm
              </b>
            </div>

          </div>

        </section>


        <section className="card">

          <div className="card-title">

            <h3>
              Quick Actions
            </h3>

          </div>


          <div className="action-grid">

            <button
              onClick={() =>
                setPage("risk")
              }
            >

              <Gauge />

              Run risk analysis

            </button>


            <button
              onClick={() =>
                setPage("ai")
              }
            >

              <Brain />

              Open AI Engine

            </button>


            <button
              onClick={() =>
                setPage("flood")
              }
            >

              <Waves />

              Open simulation

            </button>


            <button
              onClick={() =>
                setPage("alerts")
              }
            >

              <Send />

              Send alert

            </button>

          </div>

        </section>

      </div>


      <section className="card">

        <div className="card-title">

          <h3>
            System overview
          </h3>

          <span className="muted">
            Unified 5-mode risk engine
          </span>

        </div>


        <div className="overview-flow">

          <div className="flow-box">

            <Radio />

            Sensor / Manual Data

          </div>


          <span>
            →
          </span>


          <div className="flow-box">

            <Brain />

            AI Risk Engine

          </div>


          <span>
            →
          </span>


          <div className="flow-box">

            <Waves />

            2D Flood Model

          </div>


          <span>
            →
          </span>


          <div className="flow-box">

            <Bell />

            Alert

          </div>

        </div>

      </section>

    </div>
  );
}/* =========================================================
   RISK ANALYSIS
========================================================= */

function RiskAnalysis() {

  return (

    <div className="page">

      <div className="page-title">

        <div>

          <h1>
            Risk Analysis
          </h1>

          <p>
            Every reading is scored independently
            against five dam failure modes.
          </p>

        </div>


        <button className="primary">

          <Activity size={17} />

          Refresh analysis

        </button>

      </div>


      <section className="card">

        <div className="engine-head">

          <div>

            <div className="eyebrow">
              UNIFIED 5-MODE RISK ENGINE
            </div>

            <h2>
              Current reservoir risk
            </h2>

          </div>


          <div className="engine-score">

            <span>
              Overall
            </span>

            <b>
              Warning
            </b>

          </div>

        </div>


        <div className="table-wrap">

          <table>

            <thead>

              <tr>

                <th>
                  Failure Mode
                </th>

                <th>
                  Key Input Parameters
                </th>

                <th>
                  Threshold
                </th>

                <th>
                  Current Value
                </th>

                <th>
                  Status
                </th>

                <th>
                  Risk Indicator
                </th>

              </tr>

            </thead>


            <tbody>

              {failureModes.map(
                (failure) => (

                  <tr
                    key={failure.name}
                  >

                    <td>
                      <b>
                        {failure.name}
                      </b>
                    </td>


                    <td>
                      {failure.input}
                    </td>


                    <td>
                      {failure.threshold}
                    </td>


                    <td>
                      {failure.value}
                    </td>


                    <td>

                      <Status>
                        {failure.status}
                      </Status>

                    </td>


                    <td>

                      <div
                        className="progress"
                      >

                        <span
                          className={
                            failure.status
                              .toLowerCase()
                          }
                          style={{
                            width:
                              `${failure.pct}%`
                          }}
                        />

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </section>


      <div className="content-grid two">


        <section className="card">

          <h3>
            Risk logic
          </h3>


          <div className="logic-list">


            <div>

              <span className="logic-num">
                01
              </span>


              <p>

                <b>
                  Collect data
                </b>

                <br />

                <small>
                  Sensor readings or
                  inspector input.
                </small>

              </p>

            </div>


            <div>

              <span className="logic-num">
                02
              </span>


              <p>

                <b>
                  Compare thresholds
                </b>

                <br />

                <small>
                  Each failure mode is
                  evaluated separately.
                </small>

              </p>

            </div>


            <div>

              <span className="logic-num">
                03
              </span>


              <p>

                <b>
                  Set overall status
                </b>

                <br />

                <small>
                  Highest risk becomes
                  the overall dam status.
                </small>

              </p>

            </div>


          </div>

        </section>


        <section className="card">

          <h3>
            Risk levels
          </h3>


          <div className="risk-levels">


            <div>

              <Status>
                Normal
              </Status>

              <span>
                Routine monitoring
              </span>

            </div>


            <div>

              <Status>
                Watch
              </Status>

              <span>
                Increase observation
              </span>

            </div>


            <div>

              <Status>
                Warning
              </Status>

              <span>
                Prepare response
              </span>

            </div>


            <div>

              <Status>
                Critical
              </Status>

              <span>
                Immediate action
              </span>

            </div>


          </div>

        </section>


      </div>

    </div>
  );
}


/* =========================================================
   AI MODEL CARD
========================================================= */

function AIModelCard({
  model,
  onSelect
}) {

  return (

    <div
      className="ai-model-card"
      onClick={() =>
        onSelect(model)
      }
      onKeyDown={(event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          onSelect(model);

        }

      }}
      role="button"
      tabIndex={0}
      style={{
        cursor: "pointer"
      }}
    >


      <div className="ai-card-header">


        <div className="ai-icon">

          {model.icon}

        </div>


        <div className="ai-card-title">

          <h3>
            {model.title}
          </h3>


          <div className="algorithm">

            <Cpu size={14} />

            {model.algorithm}

          </div>

        </div>


        <AIStatus
          status={model.status}
        />

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


          <div className="ai-progress">

            <span
              className="risk-progress"
              style={{
                width:
                  `${model.risk}%`
              }}
            />

          </div>

        </div>


        <div className="metric-box">

          <div className="metric-label">
            AI Confidence
          </div>


          <div className="metric-value">
            {model.confidence}%
          </div>


          <div className="ai-progress">

            <span
              className="confidence-progress"
              style={{
                width:
                  `${model.confidence}%`
              }}
            />

          </div>

        </div>


      </div>


      <div className="input-section">

        <div className="input-heading">

          <Database size={14} />

          Input Parameters

        </div>


        <div className="input-tags">

          {model.inputs.map(
            (input) => (

              <span key={input}>
                {input}
              </span>

            )
          )}

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


/* =========================================================
   AI MODEL DETAIL
   BACKEND CONNECTED FOR OVERTOPPING
========================================================= */

function AIModelDetail({
  model,
  onClose
}) {

  const [backendData, setBackendData] =
    useState(null);

  const [loadingPrediction, setLoadingPrediction] =
    useState(false);

  const [predictionError, setPredictionError] =
    useState("");


  useEffect(() => {

    if (!model) {
      return;
    }


    if (model.id !== "overtopping") {
      return;
    }


    let cancelled = false;


    async function loadOvertoppingPrediction() {

      setLoadingPrediction(true);

      setPredictionError("");


      try {

        const sensorResponse =
          await fetch(
            "https://dam-guard-frontend.onrender.com/sensor/live"
          );


        if (!sensorResponse.ok) {

          throw new Error(
            "Unable to read live sensor data"
          );

        }


        const sensorData =
          await sensorResponse.json();


        const predictionResponse =
          await fetch(
            "https://dam-guard-frontend.onrender.com/predict/overtopping",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              }
            }
          );


        if (!predictionResponse.ok) {

          throw new Error(
            "Unable to get LSTM prediction"
          );

        }


        const predictionData =
          await predictionResponse.json();


        if (!cancelled) {

          setBackendData({
            sensor: sensorData,
            prediction: predictionData
          });

        }


      } catch (error) {

        console.error(
          "Overtopping prediction error:",
          error
        );


        if (!cancelled) {

          setPredictionError(
            "Backend prediction unavailable. Showing model values."
          );

        }

      } finally {

        if (!cancelled) {

          setLoadingPrediction(false);

        }

      }

    }


    loadOvertoppingPrediction();


    return () => {

      cancelled = true;

    };

  }, [model]);


  if (!model) {
    return null;
  }


  const fallback = {

    overtopping: {

      sensor:
        "Water Level + Rainfall + Inflow",

      current:
        "34.8 m",

      prediction:
        "35.7 m",

      horizon:
        "30 minutes",

      explanation:
        "The LSTM time-series model forecasts future reservoir water levels using water level, rainfall, inflow and outflow data.",

      actions: [
        "Continue continuous water-level monitoring",
        "Verify spillway discharge capacity",
        "Prepare downstream warning workflow if the trend continues"
      ]

    },


    piping: {

      sensor:
        "Seepage + Turbidity + Piezometer",

      current:
        "14 NTU",

      prediction:
        "0.24 anomaly score",

      horizon:
        "Current window",

      explanation:
        "Isolation Forest checks the current seepage-related sensor pattern for abnormal behaviour.",

      actions: [
        "Continue seepage and turbidity observation",
        "Check piezometer readings against baseline",
        "Escalate if anomaly score increases persistently"
      ]

    },


    foundation: {

      sensor:
        "Accelerometer + Seismic Vibration",

      current:
        "0.02 g",

      prediction:
        "Normal frequency pattern",

      horizon:
        "Current signal window",

      explanation:
        "FFT converts vibration signals into frequency-domain features for structural anomaly detection.",

      actions: [
        "Continue vibration monitoring",
        "Check dominant frequency against baseline",
        "Investigate sustained abnormal frequency components"
      ]

    },


    spillway: {

      sensor:
        "CCTV Frames + Gate Position",

      current:
        "2 / 5 gates open",

      prediction:
        "Gate state: Operational",

      horizon:
        "Latest CCTV frame",

      explanation:
        "YOLO detects spillway gates from CCTV imagery and classifies their operating state.",

      actions: [
        "Verify gate movement against command state",
        "Review CCTV frames for abnormal obstruction",
        "Trigger inspection if gate state disagrees with actuator feedback"
      ]

    },


    landslide: {

      sensor:
        "SAR Data + Ground Deformation",

      current:
        "12.4 mm displacement",

      prediction:
        "Increasing deformation trend",

      horizon:
        "Latest InSAR observation",

      explanation:
        "InSAR measures ground deformation and identifies persistent displacement trends.",

      actions: [
        "Review the latest deformation map",
        "Compare displacement with previous acquisitions",
        "Inspect vulnerable slopes when movement persists"
      ]

    }

  };


  const detail =
    fallback[model.id] ||
    fallback.overtopping;


  const liveSensor =
    backendData?.sensor;


  const livePrediction =
    backendData?.prediction;


  const currentValue =
    model.id === "overtopping" &&
    liveSensor
      ? `${liveSensor.water_level} m`
      : detail.current;


  const predictionValue =
    model.id === "overtopping" &&
    livePrediction
      ? `${livePrediction.predicted_water_level} m`
      : detail.prediction;


  const riskScore =
    model.id === "overtopping" &&
    livePrediction
      ? livePrediction.risk_score
      : model.risk;


  const confidence =
    model.id === "overtopping" &&
    livePrediction
      ? livePrediction.confidence
      : model.confidence;


  const currentStatus =
    model.id === "overtopping" &&
    livePrediction
      ? livePrediction.prediction
      : model.status;


  const explanation =
    model.id === "overtopping" &&
    livePrediction
      ? `The LSTM backend predicted a water level of ${livePrediction.predicted_water_level} m. The current prediction status is ${livePrediction.prediction}, with a risk score of ${livePrediction.risk_score}%.`
      : detail.explanation;


  return (

    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "rgba(2, 8, 23, 0.62)",
        backdropFilter:
          "blur(7px)"
      }}
    >


      <div
        role="dialog"
        aria-modal="true"
        aria-label={
          `${model.title} AI analysis`
        }
        onClick={(event) =>
          event.stopPropagation()
        }
        style={{
          width:
            "min(760px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          border:
            "1px solid #dbe3ec",
          borderRadius: "20px",
          boxShadow:
            "0 30px 80px rgba(15, 23, 42, 0.30)"
        }}
      >


        <div
          style={{
            padding: "22px 24px",
            color: "white",
            background:
              "linear-gradient(135deg, #071426, #172554, #0369a1)",
            borderRadius:
              "20px 20px 0 0"
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent:
                "space-between",
              gap: "16px"
            }}
          >


            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "13px"
              }}
            >

              <div
                style={{
                  width: "50px",
                  height: "50px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "14px",
                  background:
                    "rgba(255,255,255,0.12)",
                  fontSize: "25px"
                }}
              >

                {model.icon}

              </div>


              <div>

                <div
                  style={{
                    color: "#7dd3fc",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    marginBottom: "5px"
                  }}
                >
                  AI FAILURE DETECTION MODEL
                </div>


                <h2
                  style={{
                    margin: 0,
                    fontSize: "21px"
                  }}
                >
                  {model.title}
                </h2>


                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "7px",
                    color: "#bae6fd",
                    fontSize: "11px",
                    fontWeight: 800
                  }}
                >

                  <Cpu size={14} />

                  {model.algorithm}

                </div>

              </div>

            </div>


            <button
              onClick={onClose}
              aria-label="Close AI model details"
              style={{
                width: "34px",
                height: "34px",
                display: "grid",
                placeItems: "center",
                border:
                  "1px solid rgba(255,255,255,0.18)",
                borderRadius: "9px",
                background:
                  "rgba(255,255,255,0.08)",
                color: "white"
              }}
            >

              <X size={18} />

            </button>

          </div>

        </div>


        <div
          style={{
            padding: "24px"
          }}
        >


          {model.id === "overtopping" && (

            <div
              style={{
                marginBottom: "14px",
                padding: "9px 12px",
                borderRadius: "9px",
                background:
                  loadingPrediction
                    ? "#eff6ff"
                    : predictionError
                      ? "#fff7ed"
                      : "#ecfdf5",
                border:
                  loadingPrediction
                    ? "1px solid #bfdbfe"
                    : predictionError
                      ? "1px solid #fed7aa"
                      : "1px solid #bbf7d0",
                color:
                  loadingPrediction
                    ? "#2563eb"
                    : predictionError
                      ? "#c2410c"
                      : "#15803d",
                fontSize: "11px",
                fontWeight: 700
              }}
            >

              {loadingPrediction
                ? "Connecting to LSTM backend..."
                : predictionError
                  ? predictionError
                  : "✓ Live LSTM backend prediction connected"}

            </div>

          )}


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "12px",
              marginBottom: "20px"
            }}
          >


            <div
              style={{
                padding: "15px",
                background: "#f8fafc",
                border:
                  "1px solid #e2e8f0",
                borderRadius: "12px"
              }}
            >

              <small
                style={{
                  color: "#64748b",
                  fontSize: "10px"
                }}
              >
                CURRENT INPUT
              </small>


              <strong
                style={{
                  display: "block",
                  marginTop: "7px",
                  color: "#0f172a",
                  fontSize: "15px"
                }}
              >
                {currentValue}
              </strong>


              <span
                style={{
                  display: "block",
                  marginTop: "4px",
                  color: "#64748b",
                  fontSize: "10px"
                }}
              >
                {detail.sensor}
              </span>

            </div>


            <div
              style={{
                padding: "15px",
                background: "#eff6ff",
                border:
                  "1px solid #bfdbfe",
                borderRadius: "12px"
              }}
            >

              <small
                style={{
                  color: "#2563eb",
                  fontSize: "10px"
                }}
              >
                MODEL PREDICTION
              </small>


              <strong
                style={{
                  display: "block",
                  marginTop: "7px",
                  color: "#0f172a",
                  fontSize: "15px"
                }}
              >

                {loadingPrediction
                  ? "Calculating..."
                  : predictionValue}

              </strong>


              <span
                style={{
                  display: "block",
                  marginTop: "4px",
                  color: "#64748b",
                  fontSize: "10px"
                }}
              >
                {detail.horizon}
              </span>

            </div>

          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "12px",
              marginBottom: "22px"
            }}
          >


            <div
              style={{
                padding: "15px",
                background: "#f8fafc",
                borderRadius: "12px"
              }}
            >

              <small
                style={{
                  color: "#64748b",
                  fontSize: "10px"
                }}
              >
                RISK SCORE
              </small>


              <div
                style={{
                  marginTop: "5px",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#0f172a"
                }}
              >
                {riskScore}%
              </div>


              <div
                style={{
                  height: "6px",
                  marginTop: "9px",
                  background: "#e2e8f0",
                  borderRadius: "999px",
                  overflow: "hidden"
                }}
              >

                <span
                  style={{
                    display: "block",
                    width:
                      `${riskScore}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg,#f59e0b,#f97316)",
                    borderRadius: "999px"
                  }}
                />

              </div>

            </div>


            <div
              style={{
                padding: "15px",
                background: "#f8fafc",
                borderRadius: "12px"
              }}
            >

              <small
                style={{
                  color: "#64748b",
                  fontSize: "10px"
                }}
              >
                AI CONFIDENCE
              </small>


              <div
                style={{
                  marginTop: "5px",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#0f172a"
                }}
              >
                {confidence}%
              </div>


              <div
                style={{
                  height: "6px",
                  marginTop: "9px",
                  background: "#e2e8f0",
                  borderRadius: "999px",
                  overflow: "hidden"
                }}
              >

                <span
                  style={{
                    display: "block",
                    width:
                      `${confidence}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg,#2563eb,#06b6d4)",
                    borderRadius: "999px"
                  }}
                />

              </div>

            </div>

          </div>


          <div
            style={{
              marginBottom: "20px"
            }}
          >

            <div
              style={{
                color: "#0f172a",
                fontSize: "13px",
                fontWeight: 800,
                marginBottom: "8px"
              }}
            >
              How the model is working
            </div>


            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "12px",
                lineHeight: 1.7
              }}
            >
              {explanation}
            </p>

          </div>


          <div
            style={{
              marginBottom: "20px"
            }}
          >

            <div
              style={{
                color: "#0f172a",
                fontSize: "13px",
                fontWeight: 800,
                marginBottom: "9px"
              }}
            >
              Input parameters
            </div>


            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "7px"
              }}
            >

              {model.inputs.map(
                (input) => (

                  <span
                    key={input}
                    style={{
                      padding:
                        "7px 9px",
                      background:
                        "#f1f5f9",
                      borderRadius: "7px",
                      color: "#475569",
                      fontSize: "10px",
                      fontWeight: 600
                    }}
                  >
                    {input}
                  </span>

                )
              )}

            </div>

          </div>


          <div
            style={{
              padding: "16px",
              background: "#f8fafc",
              border:
                "1px solid #e2e8f0",
              borderRadius: "12px"
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: "12px",
                marginBottom: "9px"
              }}
            >

              <span
                style={{
                  color: "#64748b",
                  fontSize: "10px",
                  fontWeight: 800
                }}
              >
                CURRENT AI STATUS
              </span>


              <AIStatus
                status={currentStatus}
              />

            </div>


            <div
              style={{
                color: "#0f172a",
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: "8px"
              }}
            >
              Recommended response
            </div>


            <ul
              style={{
                margin: 0,
                paddingLeft: "18px",
                color: "#475569",
                fontSize: "11px",
                lineHeight: 1.9
              }}
            >

              {detail.actions.map(
                (action) => (

                  <li key={action}>
                    {action}
                  </li>

                )
              )}

            </ul>

          </div>

        </div>

      </div>

    </div>
  );
}/* =========================================================
   LIVE SENSOR MONITORING
========================================================= */

const liveSensorConfig = [
  {
    key: "water_level",
    name: "Water Level",
    unit: "m",
    status: "Normal",
    trend: "Live backend reading",
    icon: <Droplets size={18} />
  },

  {
    key: "rainfall",
    name: "Rainfall",
    unit: "mm/hr",
    status: "Watch",
    trend: "Live backend reading",
    icon: <Waves size={18} />
  },

  {
    key: "inflow",
    name: "Inflow",
    unit: "m³/s",
    status: "Normal",
    trend: "Live backend reading",
    icon: <ArrowRight size={18} />
  },

  {
    key: "outflow",
    name: "Outflow",
    unit: "m³/s",
    status: "Normal",
    trend: "Live backend reading",
    icon: <Navigation size={18} />
  },

  {
    key: "piezometer",
    name: "Piezometer",
    unit: "bar",
    status: "Normal",
    trend: "Live backend reading",
    icon: <Gauge size={18} />
  },

  {
    key: "seismic_vibration",
    name: "Seismic Vibration",
    unit: "g",
    status: "Normal",
    trend: "Live backend reading",
    icon: <Activity size={18} />
  },

  {
    key: "spillway_gates_open",
    name: "Spillway Gates",
    unit: "open",
    status: "Normal",
    trend: "Live backend reading",
    icon: <Eye size={18} />
  },

  {
    key: "ground_displacement",
    name: "Ground Displacement",
    unit: "mm",
    status: "Watch",
    trend: "Live backend reading",
    icon: <Satellite size={18} />
  }
];


function getSensorStatus(sensor) {

  if (!sensor) {
    return "Normal";
  }


  if (sensor.key === "water_level") {

    return sensor.value >= 36
      ? "Critical"
      : sensor.value >= 35
        ? "Warning"
        : "Normal";

  }


  if (sensor.key === "rainfall") {

    return sensor.value >= 80
      ? "Critical"
      : sensor.value >= 40
        ? "Watch"
        : "Normal";

  }


  if (sensor.key === "seismic_vibration") {

    return sensor.value >= 0.15
      ? "Critical"
      : sensor.value >= 0.08
        ? "Warning"
        : "Normal";

  }


  if (sensor.key === "ground_displacement") {

    return sensor.value >= 20
      ? "Critical"
      : sensor.value >= 10
        ? "Watch"
        : "Normal";

  }


  return sensor.status;
}


function LiveSensorMonitoring() {

  const [sensorData, setSensorData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [seconds, setSeconds] =
    useState(60);


  async function fetchLiveSensors() {

    try {

      setLoading(true);


      const response =
        await fetch(
          "https://dam-guard-frontend.onrender.com/sensor/live"
        );


      if (!response.ok) {

        throw new Error(
          `Backend returned ${response.status}`
        );

      }


      const data =
        await response.json();


      setSensorData(data);

      setError("");

      setSeconds(60);


    } catch (err) {

      console.error(
        "Live sensor API error:",
        err
      );


      setError(
        "Unable to connect to Dam Guard backend"
      );


    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    fetchLiveSensors();


    const refreshTimer =
      setInterval(
        fetchLiveSensors,
        60000
      );


    return () =>
      clearInterval(refreshTimer);

  }, []);


  useEffect(() => {

    const countdownTimer =
      setInterval(() => {

        setSeconds(
          previous =>
            previous <= 1
              ? 60
              : previous - 1
        );

      }, 1000);


    return () =>
      clearInterval(countdownTimer);

  }, []);


  const sensors =
    liveSensorConfig.map(
      config => {

        const rawValue =
          sensorData?.[config.key];


        let displayValue =
          rawValue === undefined
            ? "--"
            : rawValue;


        if (
          config.key ===
          "spillway_gates_open" &&
          rawValue !== undefined
        ) {

          displayValue =
            `${rawValue}/${sensorData?.total_gates ?? 5}`;

        }


        return {

          ...config,

          value: displayValue,

          status:
            rawValue === undefined
              ? "Normal"
              : getSensorStatus({
                  ...config,
                  value:
                    Number(rawValue)
                })

        };

      }
    );


  return (

    <section
      className="live-monitoring"
      style={{
        marginTop: "20px"
      }}
    >

      <div
        className="live-monitoring-header"
      >

        <div>

          <div
            className="live-monitoring-eyebrow"
          >

            <span
              className="live-pulse"
            />

            REAL-TIME SENSOR MONITORING

          </div>


          <h2>
            Live Dam Telemetry
          </h2>


          <p>
            Continuous monitoring of IoT
            sensors, structural signals and
            satellite-derived measurements.
          </p>

        </div>


        <div
          className="refresh-indicator"
        >

          <Radio size={16} />

          <span>
            LIVE
          </span>

          <small>

            {loading
              ? "Connecting..."
              : `Refresh in ${seconds}s`}

          </small>

        </div>

      </div>


      {error && (

        <div
          style={{
            marginBottom: "14px",
            padding: "10px 14px",
            borderRadius: "10px",
            background: "#fff7ed",
            border:
              "1px solid #fed7aa",
            color: "#c2410c",
            fontSize: "12px",
            fontWeight: 700
          }}
        >

          {error}

        </div>

      )}


      <div className="sensor-grid">

        {sensors.map(
          sensor => (

            <div
              className="sensor-card"
              key={sensor.key}
            >

              <div
                className="sensor-card-top"
              >

                <div
                  className="sensor-icon"
                >
                  {sensor.icon}
                </div>


                <AIStatus
                  status={sensor.status}
                />

              </div>


              <div className="sensor-name">
                {sensor.name}
              </div>


              <div className="sensor-value">

                {sensor.value}

                {sensor.value !== "--" && (

                  <span>
                    {sensor.unit}
                  </span>

                )}

              </div>


              <div
                className="sensor-trend"
              >

                <span
                  className="trend-dot"
                />

                {sensor.trend}

              </div>


              <div
                className="sensor-live-line"
              >

                <span />

              </div>

            </div>

          )
        )}

      </div>


      <div
        className="monitoring-footer"
      >

        <div>

          <CheckCircle2 size={15} />

          {error
            ? "Backend connection needs attention"
            : loading
              ? "Connecting to backend..."
              : "All connected sensors responding"}

        </div>


        <span>

          {loading
            ? "Synchronizing..."
            : "Last synchronized: just now"}

        </span>

      </div>

    </section>
  );
}


/* =========================================================
   AI RISK ENGINE
========================================================= */

function AIRiskEngine() {

  const [selectedModel, setSelectedModel] =
    useState(null);


  return (

    <div className="ai-page">


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
            Multi-model AI system for early
            detection of hydraulic, structural
            and geotechnical dam risks.
          </p>

        </div>


        <div className="ai-live">

          <span />

          AI ENGINE ONLINE

        </div>

      </div>


      <section className="ai-architecture">

        <div className="architecture-header">

          <div>

            <h2>
              AI Decision Pipeline
            </h2>

            <p>
              Sensor, CCTV and satellite data
              are processed through specialised
              failure prediction models.
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
              IoT Sensors
              <br />
              CCTV
              <br />
              Satellite
            </small>

          </div>


          <ArrowRight
            className="pipeline-arrow"
          />


          <div
            className="pipeline-node active"
          >

            <Brain />

            <b>
              AI Models
            </b>

            <small>
              LSTM
              <br />
              Isolation Forest
              <br />
              FFT + Isolation Forest
              <br />
              YOLO + Gate-State
              <br />
              InSAR
            </small>

          </div>


          <ArrowRight
            className="pipeline-arrow"
          />


          <div className="pipeline-node">

            <Activity />

            <b>
              Risk Fusion
            </b>

            <small>
              Risk Score
              <br />
              Confidence
              <br />
              Severity
            </small>

          </div>


          <ArrowRight
            className="pipeline-arrow"
          />


          <div
            className="pipeline-node alert-node"
          >

            <AlertTriangle />

            <b>
              Early Warning
            </b>

            <small>
              Alert
              <br />
              Response
              <br />
              Evacuation
            </small>

          </div>


        </div>

      </section>


      <div className="section-heading">

        <div>

          <h2>
            Failure Detection Models
          </h2>

          <p>
            Five specialised AI pipelines
            monitor different dam failure
            mechanisms.
          </p>

        </div>


        <div className="model-count">
          5 MODELS ACTIVE
        </div>

      </div>


      <div className="ai-model-grid">

        {aiModels.map(
          model => (

            <AIModelCard
              key={model.id}
              model={model}
              onSelect={setSelectedModel}
            />

          )
        )}

      </div>


      <LiveSensorMonitoring />


      <div className="section-heading">

        <div>

          <h2>
            Intelligence Sources
          </h2>

          <p>
            Multiple sensing technologies
            provide complementary evidence.
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
            LSTM time-series forecasting
            predicts future reservoir water-level
            behaviour for overtopping detection.
          </p>

          <div className="technical-value">

            <strong>
              35.2 m
            </strong>

            <span>
              forecast level
            </span>

          </div>

        </div>


        <div className="technical-card">

          <Eye />

          <h3>
            Computer Vision
          </h3>

          <p>
            YOLO detects spillway gates from
            CCTV imagery, followed by gate-state
            classification.
          </p>

          <div className="technical-value">

            <strong>
              5 / 5
            </strong>

            <span>
              gates detected
            </span>

          </div>

        </div>


        <div className="technical-card">

          <Satellite />

          <h3>
            Satellite Intelligence
          </h3>

          <p>
            InSAR measures ground deformation
            and displacement around vulnerable
            slopes.
          </p>

          <div className="technical-value">

            <strong>
              12.4 mm
            </strong>

            <span>
              displacement
            </span>

          </div>

        </div>


      </div>


      {selectedModel && (

        <AIModelDetail
          model={selectedModel}
          onClose={() =>
            setSelectedModel(null)
          }
        />

      )}

    </div>
  );
}/* =========================================================
   FLOOD MAP
========================================================= */

function FloodMap({ citizen = false }) {

  return (

    <div
      className={`flood-map ${
        citizen
          ? "citizen-map"
          : ""
      }`}
    >

      <div className="terrain t1" />

      <div className="terrain t2" />

      <div className="river">

        <span className="dam-dot">
          Poondi Dam
        </span>

      </div>


      <div className="flow-zone high" />

      <div className="flow-zone medium" />


      <div className="route">

        <span>
          Evacuation route
        </span>

      </div>


      <div className="map-point p1">
        Downstream Village 1
      </div>

      <div className="map-point p2">
        Downstream Village 2
      </div>

      <div className="map-point p3">
        Downstream Village 3
      </div>


      <div className="map-legend">

        <b>
          Inundation depth
        </b>

        <span>
          <i className="red" />
          High
        </span>

        <span>
          <i className="orange" />
          Medium
        </span>

        <span>
          <i className="yellow" />
          Low
        </span>

        <span>
          <i className="blue" />
          Evac. route
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   FLOOD SIMULATION
========================================================= */

function FloodSimulation() {

  const [running, setRunning] =
    useState(false);


  return (

    <div className="page">


      <div className="page-title">

        <div>

          <h1>
            Flood Simulation
          </h1>

          <p>
            2D hydrodynamic scenario
            modelling for dam-breach impact.
          </p>

        </div>


        <button
          className="primary"
          onClick={() =>
            setRunning(true)
          }
        >

          <Waves size={17} />

          {running
            ? "Simulation running..."
            : "Run Simulation"}

        </button>

      </div>


      <div className="simulation-controls">


        <div>

          <label>
            Reservoir
          </label>

          <select>

            <option>
              Poondi Reservoir
            </option>

          </select>

        </div>


        <div>

          <label>
            Scenario
          </label>

          <select>

            <option>
              Full breach — PMF inflow
            </option>

            <option>
              Partial breach
            </option>

            <option>
              Gate failure
            </option>

          </select>

        </div>


        <div className="simulation-note">

          <Activity size={17} />

          2D Shallow Water Model

        </div>

      </div>


      <div className="simulation-grid">


        <section className="card map-card">

          <FloodMap />

        </section>


        <div className="sim-stats">


          <div className="big-stat">

            <small>
              Maximum Water Depth
            </small>

            <b>
              6.4 <em>m</em>
            </b>

            <span>
              At nearest downstream
              cross-section
            </span>

          </div>


          <div className="big-stat">

            <small>
              Estimated Arrival Time
            </small>

            <b>
              2h 15 <em>min</em>
            </b>

            <span>
              To first affected settlement
            </span>

          </div>


          <div className="big-stat">

            <small>
              Affected Area
            </small>

            <b>
              18.6 <em>km²</em>
            </b>

            <span>
              High + medium
              inundation zones
            </span>

          </div>


          <div className="big-stat">

            <small>
              Affected Villages
            </small>

            <b>
              3 <em>settlements</em>
            </b>

            <span>
              Along primary flow path
            </span>

          </div>


        </div>

      </div>

    </div>
  );
}


/* =========================================================
   ALERTS
========================================================= */

function Alerts() {

  return (

    <div className="page">


      <div className="page-title">

        <div>

          <h1>
            Alerts & Response
          </h1>

          <p>
            Monitor zones and send verified
            emergency instructions.
          </p>

        </div>


        <button className="danger">

          <Siren size={17} />

          Send Emergency Alert

        </button>

      </div>


      <div className="alert-banner">

        <CircleAlert />

        <div>

          <b>
            High risk of dam breach detected.
          </b>

          <span>
            Landslide / rainfall failure mode
            has reached Critical — Poondi
            Reservoir — issued 14:32 IST.
          </span>

        </div>

      </div>


      <div className="content-grid two">


        <section className="card">

          <div className="card-title">

            <h3>
              Zones by risk level
            </h3>

            <span className="muted">
              Current model
            </span>

          </div>


          {zones.map(
            zone => (

              <div
                className="zone-row"
                key={zone.name}
              >

                <span>
                  {zone.name}
                </span>

                <Status>
                  {zone.status}
                </Status>

              </div>

            )
          )}

        </section>


        <section className="card">

          <div className="card-title">

            <h3>
              Verified volunteers
            </h3>

            <button className="secondary">
              View / Assign
            </button>

          </div>


          {[
            "Muthu Kumar — boat rescue certified",
            "Priya Lakshmi — first aid",
            "Selvam R. — logistics coordinator"
          ].map(
            (volunteer, index) => (

              <div
                className="volunteer"
                key={volunteer}
              >

                <div className="avatar">

                  {
                    ["MK", "PL", "SR"][index]
                  }

                </div>


                <div>

                  <b>
                    {
                      volunteer.split(
                        " — "
                      )[0]
                    }
                  </b>

                  <small>
                    {
                      volunteer.split(
                        " — "
                      )[1]
                    }
                  </small>

                </div>


                <CheckCircle2
                  size={17}
                />

              </div>

            )
          )}

        </section>

      </div>


      <section className="card">

        <h3>
          Authority instructions
        </h3>


        <div className="instruction">

          <span>
            1
          </span>

          <p>
            Open spillway gates to
            design discharge.
          </p>

        </div>


        <div className="instruction">

          <span>
            2
          </span>

          <p>
            Notify district control room
            and field response teams.
          </p>

        </div>


        <div className="instruction">

          <span>
            3
          </span>

          <p>
            Broadcast evacuation guidance
            to Villages 1–3.
          </p>

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   REPORTS
========================================================= */

function Reports() {

  const reports = [

    [
      "Daily Safety Report",
      "27 Sep 2026",
      "Warning",
      "PDF"
    ],

    [
      "Flood Simulation — Full Breach",
      "27 Sep 2026",
      "Completed",
      "PDF"
    ],

    [
      "Sensor & Inspector Data",
      "26 Sep 2026",
      "Reviewed",
      "CSV"
    ],

    [
      "Weekly Dam Safety Summary",
      "22 Sep 2026",
      "Completed",
      "PDF"
    ]

  ];


  return (

    <div className="page">


      <div className="page-title">

        <div>

          <h1>
            Reports
          </h1>

          <p>
            Downloadable monitoring,
            simulation and inspection records.
          </p>

        </div>


        <button className="primary">

          <FileText size={17} />

          Generate Report

        </button>

      </div>


      <section className="card">

        <div className="table-wrap">

          <table>


            <thead>

              <tr>

                <th>
                  Report
                </th>

                <th>
                  Date
                </th>

                <th>
                  Status
                </th>

                <th>
                  Format
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {reports.map(
                report => (

                  <tr
                    key={report[0]}
                  >

                    <td>

                      <b>
                        {report[0]}
                      </b>

                    </td>


                    <td>
                      {report[1]}
                    </td>


                    <td>

                      <Status>
                        {report[2]}
                      </Status>

                    </td>


                    <td>
                      {report[3]}
                    </td>


                    <td>

                      <button
                        className="download"
                      >
                        Download
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>


          </table>

        </div>

      </section>

    </div>
  );
}/* =========================================================
   CITIZEN PORTAL
========================================================= */

function CitizenPortal() {

  return (

    <div className="citizen-page">


      <div className="citizen-top">

        <div className="brand">

          <div className="brand-icon">

            <Waves size={19} />

          </div>


          <b>
            Dam Guard
          </b>

        </div>


        <span>
          CITIZEN · VILLAGE 1
        </span>

      </div>


      <div className="citizen-alert">

        <AlertTriangle />

        <div>

          <b>
            Flood warning issued
            for your area
          </b>

          <span>
            Poondi Reservoir · Critical risk
            · issued 14:32 IST. Move to
            higher ground now.
          </span>

        </div>

      </div>


      <div className="citizen-grid">


        <div>

          <FloodMap citizen />

        </div>


        <div className="citizen-side">


          <div className="citizen-card">

            <small>
              Your area status
            </small>


            <h3>

              <Status>
                Critical
              </Status>

              Zone A · Village 1

            </h3>

          </div>


          <div className="citizen-card">

            <small>
              Nearest shelter
            </small>


            <h3>
              Govt. Higher Secondary School
            </h3>


            <p>
              1.8 km · 22 min on foot
            </p>


            <button className="primary full">

              <Navigation size={16} />

              Get Directions

            </button>

          </div>


          <div className="citizen-card">

            <small>
              What you should do
            </small>


            <ol>

              <li>
                Move to the shelter shown
                above immediately.
              </li>

              <li>
                Carry ID, medicines and
                drinking water only.
              </li>

              <li>
                Avoid riverbanks and
                low-lying roads.
              </li>

              <li>
                Follow instructions from
                field volunteers.
              </li>

            </ol>

          </div>


          <div className="citizen-card">

            <small>
              Emergency contacts
            </small>


            <div className="contact">

              <span>
                District Control Room
              </span>

              <b>
                1077
              </b>

            </div>


            <div className="contact">

              <span>
                Ambulance
              </span>

              <b>
                108
              </b>

            </div>


            <div className="contact">

              <span>
                Village Coordinator
              </span>

              <b>
                98xx xx4471
              </b>

            </div>

          </div>


        </div>

      </div>

    </div>
  );
}


/* =========================================================
   LOGIN
========================================================= */

function Login({ onLogin }) {

  const [mode, setMode] =
    useState("authority");


  return (

    <div className="login-page">


      <div className="login-art">


        <div className="login-brand">

          <div className="brand-icon">

            <Waves />

          </div>


          <h2>
            Dam Guard
          </h2>

        </div>


        <div className="login-copy">

          <h1>
            Continuous dam safety monitoring
          </h1>


          <p>
            Early flood warnings for Poondi
            Reservoir and downstream communities.
          </p>

        </div>

      </div>


      <div className="login-panel">


        <div className="login-box">


          <div className="login-title">

            <Waves />

            <h2>
              Dam Guard
            </h2>

            <p>
              Choose how you're accessing
              the platform.
            </p>

          </div>


          <div className="role-tabs">


            <button
              className={
                mode === "authority"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setMode("authority")
              }
            >

              <ShieldCheck />


              <span>

                <b>
                  Authority login
                </b>

                <small>
                  Full monitoring, simulation
                  and alerting access.
                </small>

              </span>

            </button>


            <button
              className={
                mode === "citizen"
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setMode("citizen")
              }
            >

              <Users />


              <span>

                <b>
                  Citizen login
                </b>

                <small>
                  Live warnings, shelters
                  and safety guidance.
                </small>

              </span>

            </button>


          </div>


          <label>
            Employee ID
          </label>


          <input
            placeholder={
              mode === "authority"
                ? "TWAD-AUTH-00214"
                : "VILLAGE-001"
            }
          />


          <label>
            Password
          </label>


          <input
            type="password"
            placeholder="••••••••••"
          />


          <button
            className="primary login-btn"
            onClick={() =>
              onLogin(mode)
            }
          >

            {mode === "authority"
              ? "Continue as Authority"
              : "Continue as Citizen"}

          </button>


        </div>

      </div>

    </div>
  );
}


/* =========================================================
   MAIN APP
========================================================= */

export default function App() {

  const [loggedIn, setLoggedIn] =
    useState(false);


  const [role, setRole] =
    useState("authority");


  const [page, setPage] =
    useState("dashboard");


  const [mobileOpen, setMobileOpen] =
    useState(false);


  if (!loggedIn) {

    return (

      <Login
        onLogin={(selectedRole) => {

          setRole(selectedRole);

          setLoggedIn(true);

        }}
      />

    );

  }


  if (role === "citizen") {

    return (
      <CitizenPortal />
    );

  }


  return (

    <div className="app-shell">


      <Sidebar
        page={page}
        setPage={setPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />


      <main className="main">


        <Header
          setMobileOpen={setMobileOpen}
        />


        {page === "dashboard" && (

          <Dashboard
            setPage={setPage}
          />

        )}


        {page === "risk" && (

          <RiskAnalysis />

        )}


        {page === "ai" && (

          <AIRiskEngine />

        )}


        {page === "flood" && (

          <FloodSimulation />

        )}


        {page === "alerts" && (

          <Alerts />

        )}


        {page === "reports" && (

          <Reports />

        )}


      </main>

    </div>
  );
}