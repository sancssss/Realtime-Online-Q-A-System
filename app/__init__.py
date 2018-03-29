from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO

socketio = SocketIO()
app = Flask(__name__,  static_folder="../app-frontend/build/static", template_folder="../app-frontend/build/static")
from .main import main as main_blueprint
app.register_blueprint(main_blueprint)
app.debug = True
app.threaded = True
app.config['SECRET_KEY'] = 'sanc'
socketio.init_app(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/interaction_yzu'
db = SQLAlchemy(app)

from .main import server, api, events
