# one-tap-away

Save this Dockerfile in the same directory as your app.py and requirements.txt.

docker build -t flask-hello-world .

docker run -p 8080:8080 flask-hello-world

Open your browser and go to http://127.0.0.1:5000/ to see "Hello, World!".

Make sure you have gcloud

gcloud config set project our-lacing-496620-t5

gcloud services enable run.googleapis.com artifactregistry.goog
leapis.com

if not logged in: gcloud auth login

gcloud auth configure-docker northamerica-northeast1-docker.pkg.dev

and then we build and push

# MAC Build and Push

docker buildx build --platform linux/amd64 -t northamerica-northeast1-docker.pkg.dev/our-lacing-496620-t5/my-repo/flask-app:latest .


docker push northamerica-northeast1-docker.pkg.dev/our-lacing-496620-t5/my-repo/flask-app:latest


gcloud run deploy flask-app \
  --image northamerica-northeast1-docker.pkg.dev/our-lacing-496620-t5/my-repo/flask-app:latest \
  --platform managed \
  --region northamerica-northeast1 \
  --allow-unauthenticated \
  --port 8080


# WINDOWS
n/a

# Visit the URL
Service URL: https://flask-app-890590900340.northamerica-northeast1.run.app