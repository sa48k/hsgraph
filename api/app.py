from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from hsgraph import *

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 5 # 5MB max for now

@app.route('/', methods=['GET'])
def home():
	return "<h1>HSGraph API Test v0.1</h1>"

@app.route('/post', methods=['POST'])
@cross_origin()
def process():
    print('RECEIVED A POOOOST')
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(os.path.join('.', filename))
    resp = jsonify({'message': 'OK'})#, 'data': data})
    resp.status_code = 200
    return resp

if __name__ == "__main__":
	app.run()