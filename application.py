import os

from flask import Flask, session, render_template, redirect, url_for, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.secret_key = 'asfsdshfsdjkh'
socketio = SocketIO(app)


channels = []
c = {"name":"general", "creator":"flack", "messages":[]}
channels.append(c)


@app.route("/", methods=['POST', 'GET'])
def index():
    if 'username' not in session:
        if request.method == 'GET':
            return redirect(url_for('signin'))
        session['username'] = request.form.get('username')
    if 'channel' not in session:
        session['channel'] = channels[0]
    return render_template('index.html', username=session['username'], channel=session['channel'])


@app.route('/channels', methods=['POST'])
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
        c = {"name":name, "creator":session['username']}
        channels.append(c)
    return redirect(url_for('index'))


@app.route("/sign-in")
def signin():
    return render_template('signin.html')


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))
