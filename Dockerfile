# Use official Python slim image
FROM python:3.11-slim

# Install OS-level build tools & Rust for slixmpp
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential gcc libffi-dev cargo rustc && \
    rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy and install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project
COPY . .

# Expose ports
EXPOSE 5000 5222 5280

# Run unified dashboard + agents
CMD ["python", "-m", "src.main"]
