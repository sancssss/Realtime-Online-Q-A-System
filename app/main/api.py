from flask_restful import Resource, Api
from .. import db
from . import main
from flask import request
from flask_cors import CORS
from .models import User, AuthAssignment, ROLE_STUDENT, ROLE_TEACHER
import json

CORS(main, resources={r"/*": {"origins": "*"}})
api = Api(main)

class HelloWorld(Resource):
    def get(self):
        return {'just': 'test hhhhhhh'}

api.add_resource(HelloWorld, '/')

class UserLogin(Resource):
    def put (self):
        data = request.get_json()
        request_username = data['username']
        request_password = data['password']
        db_user = User.query.filter_by(user_number=request_username).first()
        check_password = db_user.check_password(password = request_password)
        #print("login_log" + request.get_json()['username']);
        if(db_user and check_password):
            #print("login_log" + request.get_json()['username']);
            return {'isOk': '1'}
        else:
            return {'isOk': '0'}

api.add_resource(UserLogin, '/Login')
