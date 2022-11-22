from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from hsgraph import *

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

@app.route('/', methods=['GET'])
def home():
	return "<h1>HSGraph API Test v0.1</h1>"

@app.route('/post', methods=['POST'])
@cross_origin()
def process():
	if not request.files:
		resp = jsonify({'message': 'No file found in request'})
		resp.status_code = 400
		print('Error 400 No file found')
		return resp
	for f in request.files:
		print(f)
		infile = request.files[f].read()
		data = buildData(infile)
  	# processing from hshpgraph.py goes here
	resp = jsonify({'message': 'OK', 'data': data})
	resp.status_code = 200
	return resp

if __name__ == "__main__":
	app.run()