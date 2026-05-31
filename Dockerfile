# Use the official Python image as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Use the PORT environment variable set by Cloud Run
ENV PORT=8080

# Expose the port for Cloud Run
EXPOSE 8080

# Command to run the application
CMD ["python", "app.py"]