from flask_restful import Resource, Api
from .. import db, app
from sqlalchemy import func
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
    """user object{user_id, password}"""
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
    """question object{user_id, questionText, answerValue, minuteText}"""
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

class Answer(Resource):
    """question int id"""
    def get(self, id):
        request_question = QuestionQuick().query.filter_by(question_id=id).first()#need role authentication
        if(request_question):
            return {'isOk': '1', 'answer': request_question.question_answer}

api.add_resource(Answer, '/Answer/<int:id>')

class AnswerRecord(Resource):
    def get(self, action, id):
        if(action == 'statistic'):
            if(id):
                total_record_count = StudentAnswerRecord().query.filter_by(user_number=id).count()
                print('total_record_count', total_record_count)
                correct_record_count = StudentAnswerRecord().query.filter_by(user_number=id, is_correct=1).count()
                print('correct_record_count', correct_record_count)
                return {'isOk': '1', 'total_record_count': total_record_count, 'correct_record_count': correct_record_count}
            else:
                return {'isOk': '0'}

    #put the object{userid, question_id, is_correct}
    def put(self):
        data = request.get_json()
        request_userid = data['userid']
        request_question_id = data['questionId']
        request_is_correct = int(data['isCorrect'])
        if(request_userid and request_question_id and request_is_correct):
            request_answer_time = time.time()
            new_answer_record = StudentAnswerRecord(user_number=request_userid, question_id=request_question_id, is_correct=request_is_correct, answer_time=request_answer_time)
            db.session.add(new_answer_record)
            db.session.commit()
        else:
            return {'isOk': '0'}
        return {'isOk': '1'}

api.add_resource(AnswerRecord,  '/AnswerRecord', '/AnswerRecord/<int:id>/<string:action>')
