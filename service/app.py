import os
import io
from flask import Flask, request
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from utils.parse import parse_pdf
from utils.api import call_gpt, call_davinci


app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

@app.route('/')
def hello_world():
    return 'Hello, World!'

# Define a post method to parse a pdf file
# Set cors to allow the request from the frontend
@app.route('/pdf', methods=['POST'])
@cross_origin()
def upload_pdf():

    # Get the file upload from the request
    file = request.files['pdf']
    # Save the file to the upload folder
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
     
    # Get the text from the pdf file
    # Parse the pdf file
    text = parse_pdf(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    # Call with the davinci
    # response = call_davinci(message=text)

    # Call with the gpt-3.5-turbo
    message = f"""
        Summarize this text: {text}, and return the summary.
        And alose give me a series of questions about information, insights, and suggestions related to this file.
        Please give me the related questions in the next line.
    """

    response = call_gpt(prompt=message)

    # return response with json format
    return response

# Open-ended chat with gpt-3.5-turbo
@app.route('/chat', methods=['POST'])
@cross_origin()
def chat_with_gpt():
    text = request.json['message']
    print(text)
    response = call_gpt(prompt=text)
    return response

if __name__ == '__main__':
    app.config['UPLOAD_FOLDER'] = 'upload'
    # Listen on the localhost
    # conditions for dev & prod env
    if os.environ.get('FLASK_ENV') == 'dev':
        app.run(host='localhost', debug=True, port=8000)
    else:
        app.run(host='0.0.0.0', port=8000)

