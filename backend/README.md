# Vantage AI - FastAPI Auxiliary Backend Service

Lightweight, production-ready Python microservice for SSRF-safe link verification, product detail extraction, and semantic vector matching with ChromaDB / Sentence-Transformers.

---

## Features
- **POST `/verify-links`**: Accepts list of URLs, validates against Indian shopping allowlist, applies SSRF filter (blocking internal/private IP ranges), follows HTTP redirects via `httpx`, detects product detail pages (PDPs), and returns statuses.
- **POST `/extract`**: Extracts title, price, rating, image, and key specs. Results cached in-memory for 6 hours.
- **POST `/embed-search`**: Semantic embedding search using `sentence-transformers` (`BAAI/bge-small-en-v1.5`) & `ChromaDB` (with automatic in-memory vector fallback).
- **GET `/health`**: Health status and uptime endpoint.
- **Resilient Fallback**: The Vantage frontend continues to work seamlessly with the Node/Express + Gemini pipeline even if this Python backend is offline or sleeping.

---

## Step-by-Step Deployment Instructions on Render (Free Tier)

### Step 1: Create a Render Web Service
1. Sign up or log in at [render.com](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository containing the Vantage project.

### Step 2: Configure Service Settings
- **Name**: `vantage-python-backend` (or your preferred name)
- **Root Directory**: `backend`
- **Environment**: `Python` or `Docker`
  - If selecting **Python**:
    - Build Command: `pip install -r requirements.txt`
    - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
  - If selecting **Docker**:
    - Render will automatically build the included `backend/Dockerfile`.
- **Instance Type**: **Free** (0.5 CPU, 512 MB RAM)

### Step 3: Configure Environment Variables
In the Render dashboard, go to the **Environment** tab and add:
- `PORT`: `8000` (or leave default, Render sets this automatically)
- `ALLOWED_ORIGINS`: Your frontend URL, e.g.:
  `https://ais-dev-a2ixnf5atagwubayx53sgz-771944310684.asia-southeast1.run.app,https://ais-pre-a2ixnf5atagwubayx53sgz-771944310684.asia-southeast1.run.app`
- `VANTAGE_BACKEND_API_KEY`: A secure random key (optional, e.g. `vantage_sec_9381029`)
- `ENVIRONMENT`: `production`

### Step 4: Connect to Your Frontend
Once deployed, copy your Render service URL (e.g., `https://vantage-python-backend.onrender.com`).
In your frontend environment or `.env` file, set:
```bash
VITE_PYTHON_BACKEND_URL=https://vantage-python-backend.onrender.com
VITE_PYTHON_BACKEND_API_KEY=vantage_sec_9381029
```

---

## Important Note on Render Free Tier Cold Starts
- **Cold Start Behavior**: Render spins down free tier Web Services after **15 minutes of inactivity**. When a new request arrives, it takes approximately **45 to 60 seconds** to wake up.
- **Zero Frontend Impact**: Thanks to the resilient design in `src/api.ts`, frontend requests to `/verify-links`, `/extract`, and `/embed-search` use a strict 4.5-second timeout with non-blocking promises. If the Python backend is spinning up or unavailable, the application immediately falls back to the native Node.js / Gemini grounding pipeline. Users experience zero interruption.
- **Keep-Alive (Optional)**: To prevent spin-downs during active testing, you can set up a free scheduled ping (e.g. via [cron-job.org](https://cron-job.org) or UptimeRobot) targeting `https://<your-service>.onrender.com/health` every 10 minutes.
