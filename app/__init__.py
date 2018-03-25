from flask import Flask
from flask_socketio import SocketIO
from .main import server


socketio = SocketIO()

def create_app(debug=False):
    """create an application"""
    app = Flask(__name__,  static_folder="../socket-client/src", template_folder="../socket-client/public")
    app.debug = debug
    app.config['SECRET_KEY'] = 'sanc'

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    socketio.init_app(app)
    return app
