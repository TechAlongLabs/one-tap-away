from flask import Flask, request
import os

app = Flask(__name__)

@app.route('/')
def hello_world():
    return '''
        <html>
            <head>
                <title>Hello, Flask!</title>
            </head>
            <body>
                <h1>Hello, World!</h1>
                <button onclick="alert('You clicked the button!')">Click Me</button>
            </body>
        </html>
    '''

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)