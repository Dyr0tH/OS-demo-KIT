from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes and origins

@app.route('/run-command', methods=['POST'])
def run_command():
    data = request.get_json()

    # Extract the command from the request body
    command = data.get('command')

    if not command:
        return jsonify({'error': 'No command provided'}), 400

    try:
        # Execute the command and capture output
        result = subprocess.run(command, shell=True, text=True, capture_output=True)
        
        if result.returncode != 0:
            return jsonify({'error': result.stderr}), 500
        
        return jsonify({'output': result.stdout})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Make sure it's accessible from outside the container
