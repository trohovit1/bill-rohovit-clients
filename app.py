from flask import Flask, request, jsonify
import pandas as pd
import os

app = Flask(__name__)
EXCEL_PATH = 'clients.xlsx'

def read_excel():
    if os.path.exists(EXCEL_PATH):
        return pd.read_excel(EXCEL_PATH).to_dict(orient='records')
    return []

def write_excel(data):
    df = pd.DataFrame(data)
    df.to_excel(EXCEL_PATH, index=False)

@app.route('/clients', methods=['GET'])
def get_clients():
    return jsonify(read_excel())

@app.route('/clients', methods=['POST'])
def update_clients():
    data = request.json
    write_excel(data)
    return jsonify({'status': 'success'})

@app.route('/')
def index():
    return "<h1>Client API is running</h1><p>Use /clients to GET or POST data</p>"

if __name__ == '__main__':
    app.run()
