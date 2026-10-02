# Dam Guard — RescueRise Frontend

React + Vite frontend prototype based on the provided Dam Guard screens.

## Run

1. Install Node.js (LTS).
2. Open this folder in VS Code.
3. Run:

```bash
npm install
npm run dev
```

4. Open the localhost URL shown by Vite.

## Included screens

- Authority Login
- Dashboard
- Risk Analysis
- Flood Simulation
- Alerts & Response
- Reports
- Citizen Portal

## Backend integration

The UI currently uses demo values so it works immediately. Replace the demo values with API calls from your Flask backend.

Suggested API endpoints:

- `GET /api/dam/status`
- `GET /api/risk`
- `POST /api/manual-data`
- `POST /api/flood-simulation`
- `GET /api/alerts`
- `GET /api/reports`
- `POST /api/alerts/send`

The map is a frontend visualization placeholder. For the real implementation, connect it to Leaflet/MapLibre and your GIS/DEM/flood-model output.
