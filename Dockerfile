# Use a Python base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the local files to the container
COPY linuxCompilerINOUT.py /app/
COPY requirements.txt /app/

# Install dependencies (Flask)
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5000 (Flask default port)
EXPOSE 5000

# Command to run the Flask app
CMD ["python", "linuxCompilerINOUT.py"]
