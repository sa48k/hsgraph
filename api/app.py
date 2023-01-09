from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from hsgraph import *

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = False
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 5 # 5MB max for now

@app.route('/', methods=['GET'])
def home():
	return "<h1>HSGraph API Test v0.1</h1>"

@app.route('/post', methods=['POST'])
@cross_origin()
def process():
    file = request.files['file']
    try:
        xmlsource = file.read()
        data = buildData(xmlsource)
        return data
    except AssertionError as e:
        error = {"message": f"{file.filename}: {e.args[0]}", "status": 400}
        return error, 400

if __name__ == "__main__":
	app.run(host="0.0.0.0", debug="False")