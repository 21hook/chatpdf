# Build from python:3.9-bullseye
FROM python:3.9-bullseye
# Set working directory
WORKDIR /usr/src/app
# Copy requirements.txt
COPY requirements.txt ./
# Install dependencies
RUN pip install -r requirements.txt
# Copy source code
COPY . .
# Expose port 8000
EXPOSE 8000
# Run app
CMD [ "python", "app.py" ]