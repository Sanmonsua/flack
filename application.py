import os

from flask import Flask, session, render_template, redirect, url_for, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.secret_key = 'asfsdshfsdjkh'
socketio = SocketIO(app)


@app.route("/", methods=['POST', 'GET'])
def index():
    if 'username' not in session:
        if request.method == 'GET':
            return redirect(url_for('signin'))
        session['username'] = request.form.get('username')
    return render_template('index.html', username=session['username'])


@app.route("/sign-in")
def signin():
    return render_template('signin.html')


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))
