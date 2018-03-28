from flask_restful import Resource, Api
from . import main
from flask import request
from flask_cors import CORS
import json

CORS(main, resources={r"/*": {"origins": "*"}})
api = Api(main)

class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

api.add_resource(HelloWorld, '/')

class UserLogin(Resource):
    def put (self):
        data = request.get_json()
        #print("login_log" + request.get_json()['username']);
        if(data['username'] == '1' or data['username'] == '2'):
            #print("login_log" + request.get_json()['username']);
            return {'isOk': '1'}
        else:
            return {'isOk': '0'}

api.add_resource(UserLogin, '/Login')
