import os

from flask import Flask, session, render_template, redirect, url_for, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.secret_key = 'asfsdshfsdjkh'
socketio = SocketIO(app)


channels = []
c = {"name":"general", "creator":"flack", "messages":['hello']}
channels.append(c)


@app.route("/", methods=['POST', 'GET'])
def index():
    if 'username' not in session:
        if request.method == 'GET':
            return redirect(url_for('signin'))
        session['username'] = request.form.get('username')
    return render_template('index.html', username=session['username'])


@app.route('/channels')
def get_channels():
    return jsonify(channels)


@app.route('/add-channel', methods=['POST'])
def add_channel():
    name = request.form.get('name')
    existed = False
    for channel in channels:
        if name == channel['name']:
            existed = True
    if not existed:
        c = {"name":name, "creator":session['username'], "messages":[]}
        channels.append(c)
        session['channel'] = c;
    return jsonify({'existed':existed})


@app.route('/load-channel', methods=['POST', 'GET'])
def loadChannel():
    if request.method == 'POST':
        name = request.form.get('name')
        for c in channels:
            if c['name'] == name:
                session['channel'] = c;
    return jsonify(session['channel'])


@app.route("/sign-in")
def signin():
    return render_template('signin.html')


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))
