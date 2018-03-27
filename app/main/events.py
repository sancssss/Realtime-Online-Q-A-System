from flask import session
from flask_socketio import emit, join_room, leave_room
import logging
from flask_socketio import SocketIO

socketio = SocketIO()

@socketio.on('joined', namespace='/class')
def handle_joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    print("===someone joined===")
    room = 1
    join_room(room)
    emit('joined', message, namespace='/class', room=room)


@socketio.on('text', namespace='/class')
def handle_text(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    print("===someone text===")
    room = 1
    emit('text', message, namespace='/class', room=room)


@socketio.on('left', namespace='/class')
def handle_left(message, namesapce='/class'):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    room = 1
    leave_room(1)
    emit('left', {'msg': session.get('name') + ' has left the room.'})
