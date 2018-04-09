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
        db_user = User.query.filter_by(user_number=141304120).first().user_number
        return {'just': db_user}

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
        #get the latest record to get the roomid
        roomId = QuestionQuick.query.filter_by(user_number=request_userid).order_by("create_time desc").first().question_id
        print("room ID", roomId)
        endTime = QuestionQuick.query.filter_by(question_id=roomId).first().end_time
        return {'isOk': '1', 'room_id': roomId, 'end_time':endTime }

    def get(self, id):
        request_question = QuestionQuick().query.filter_by(question_id=id).first()
        if(request_question):
            return {'isOk': '1', 'create_user': request_question.user_number, 'question_content': request_question.question_content, 'create_time': request_question.create_time, 'end_time': request_question.end_time}
        return {'isOk': 0}

api.add_resource(QuickQuestion, '/QuickQuestion', '/QuickQuestion/<int:id>')
