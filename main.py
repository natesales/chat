import os
from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(64)
socketio = SocketIO(app, cors_allowed_origins = '*')

@app.route("/")
def sessions():
    return render_template("app.html")

@socketio.on("message")
def message(json):
    print("Received message: " + str(json))
    socketio.emit("message", json)

@socketio.on("typing")
def typing(json):
    print("Received typing: " + str(json))
    socketio.emit("typing", json)

@socketio.on("connect")
def connect():
    socketio.emit("server_message", {"message": "User joined."})

@socketio.on("bomb")
def bomb(username):
    socketio.emit("bomb", username)

if __name__ == "__main__":
    socketio.run(app, host="", port=7000, debug=True)

