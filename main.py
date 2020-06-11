import os
from flask import Flask, render_template, request, session, redirect
from flask_socketio import SocketIO, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(64)
socketio = SocketIO(app, cors_allowed_origins = '*')

@app.route("/")
def login():
    return render_template("login.html")

@app.route("/chat/<room_id>")
def sessions(room_id):
    return render_template("app.html")

@socketio.on("join-room")
def joinaroom(data):
    join_room(data['room'])

@socketio.on("message")
def message(json):
    print("Received message: " + str(json))
    socketio.emit("message", json, room=json['room'])

@socketio.on("typing")
def typing(json):
    print("Received typing: " + str(json))
    socketio.emit("typing", json, room=json['room'])

@socketio.on("connect")
def connect():
    socketio.emit("server_message", {"message": "User joined."})

@socketio.on("bomb")
def bomb(json):
    socketio.emit("bomb", json, room=json['room'])

if __name__ == "__main__":
    socketio.run(app, host="127.0.0.1", port=7000, debug=True)
