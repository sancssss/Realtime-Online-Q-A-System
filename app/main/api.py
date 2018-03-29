from flask_restful import Resource, Api
from .. import db, app
from . import main
from flask import request
from flask_cors import CORS
from .models import User, AuthAssignment, QuestionQuick, StudentAnswerRecord
import json, time

CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

class HelloWorld(Resource):
    def get(self):
        testval = QuestionQuick.query.filter_by(user_number=123456).first().question_content
        data = request.get_json()
        request_userid = 123456
        request_question_text = '3'
        request_answer_value = '3'
        request_minute_text = 3
        request_create_time = time.time()
        request_end_time = time.time() + int(request_minute_text) * 60
        ###heck user Validity by session or flask_login
        #print("login_log" + request.get_json()['username']);
        new_quickquestion = QuestionQuick()
        return {'just': json.dumps(new_quickquestion.__dict__)}

api.add_resource(HelloWorld, '/')

class UserLogin(Resource):
    def put (self):
        data = request.get_json()
        request_userid = data['userid']
        request_password = data['password']
        db_user = User.query.filter_by(user_number=request_userid).first()
        #print("login_log" + request.get_json()['username']);
        if(db_user and db_user.check_password(password = request_password)):
            user_assignment = AuthAssignment.query.filter_by(user_id=request_userid).first()
            user_role = user_assignment.item_name
            #print("login_log" + user_role);
            return {'isOk': '1', 'role': user_role}
        else:
            return {'isOk': '0'}

api.add_resource(UserLogin, '/Login')

class QuickQuestion(Resource):
    def put (self):
        data = request.get_json()
        request_userid = data['userid']
        request_question_text = data['questionText']
        request_answer_value = data['answerValue']
        request_minute_text = data['minuteText']
        request_create_time = time.time()
        request_end_time = time.time() + int(request_minute_text) * 60
        ###heck user Validity by session or flask_login
        #print("login_log" + request.get_json()['username']);
        new_quickquestion = QuestionQuick(user_number=request_userid, question_content=request_question_text, question_answer=request_answer_value, create_time=request_create_time, end_time=request_end_time)
        db.session.add(new_quickquestion)
        db.session.commit()
        return {'isOk': '1'}

api.add_resource(QuickQuestion, '/QuickQuestion')
