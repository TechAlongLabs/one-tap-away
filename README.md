# One Tap Away (Cloud Run, Single Service)

This project serves both:

- React frontend (built in Docker, served from Flask static files)
- Flask backend API (`/chat`, `/chat_with_semantic_search`, `/health`)

## Local Build and Run

Build image:

```bash
docker build -t one-tap-away:local .
```

Run container locally:

```bash
docker run --rm -p 8080:8080 \
  -e PORT=8080 \
  -e GEMINI_API_KEY="YOUR_KEY_HERE" \
  one-tap-away:local
```

Open:

- `http://127.0.0.1:8080/` (frontend)
- `http://127.0.0.1:8080/health` (health)

## GCP Setup

Set project:

```bash
gcloud config set project our-lacing-496620-t5
```

Enable required services:

```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com
```

Authenticate if needed:

```bash
gcloud auth login
gcloud auth configure-docker northamerica-northeast1-docker.pkg.dev
```

## Secret Manager

Create secret one time:

```bash
printf '%s' 'YOUR_REAL_GEMINI_API_KEY' | \
gcloud secrets create ota-gemini-api-key --data-file=-
```

If secret already exists, add a new version:

```bash
printf '%s' 'YOUR_REAL_GEMINI_API_KEY' | \
gcloud secrets versions add ota-gemini-api-key --data-file=-
```

## Build and Push Image

```bash
docker buildx build --platform linux/amd64 \
  -t northamerica-northeast1-docker.pkg.dev/our-lacing-496620-t5/my-repo/one-tap-away:latest \
  .

docker push northamerica-northeast1-docker.pkg.dev/our-lacing-496620-t5/my-repo/one-tap-away:latest
```

## Deploy to Cloud Run

```bash
gcloud run deploy one-tap-away \
  --image northamerica-northeast1-docker.pkg.dev/our-lacing-496620-t5/my-repo/one-tap-away:latest \
  --platform managed \
  --region northamerica-northeast1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-secrets GEMINI_API_KEY=ota-gemini-api-key:latest \
  --timeout 300
```

## Notes

- The app attempts to refresh Google Sheets data at startup.
- If refresh fails, startup continues using bundled `artifacts/spreadsheet_data.json`.
- Do not commit real `.env` secrets. Use Secret Manager for production.