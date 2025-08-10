# FinDocGPT - Integrated Frontend & Backend
FROM node:18-alpine as frontend-build

# Build React frontend
WORKDIR /app/frontend
COPY fincorp-insight-hub-main/package*.json ./
RUN npm install
COPY fincorp-insight-hub-main/ ./
RUN npm run build

# Python backend
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python backend files
COPY *.py ./
COPY config.py ./
COPY data/ ./data/
COPY vectorstore_cache/ ./vectorstore_cache/

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./static

# Create startup script
COPY start-docker.sh ./
RUN chmod +x start-docker.sh

# Expose ports
EXPOSE 8000

# Set environment variables
ENV PYTHONPATH=/app
ENV GOOGLE_API_KEY=""

# Start the application
CMD ["./start-docker.sh"]
