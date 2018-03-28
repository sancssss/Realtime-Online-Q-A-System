from flask import Flask

from .main import server, api, events
from .main.events import socketio



app = Flask(__name__,  static_folder="../app-frontend/build/static", template_folder="../app-frontend/build/static")


def create_app(debug=False):
    """create an application"""
    app.debug = debug
    app.config['SECRET_KEY'] = 'sanc'
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)
    socketio.init_app(app)
    return app
