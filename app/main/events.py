from flask import session
from flask_socketio import emit, join_room, leave_room
import logging
from .. import socketio


@socketio.on('joined', namespace='/class')
def handle_joined(message, roomId):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    room = roomId
    print("===someone joined===roomId:" + room)
    join_room(room)
    emit('joined', message, namespace='/class', room=room)


@socketio.on('text', namespace='/class')
def handle_text(message, roomId):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    room = roomId
    print("===someone text===roomId:" + room)
    emit('text', message, namespace='/class', room=room)


@socketio.on('left', namespace='/class')
def handle_left(message, roomId):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    room = roomId
    print("===someone left===roomId:" + room)
    leave_room(room)
    emit('left', message, namespace='/class', room=room)
