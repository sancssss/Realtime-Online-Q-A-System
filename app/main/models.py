# -*- coding: UTF-8 -*-
from app import db
from flask_sqlalchemy import SQLAlchemy
from . import main

#initiate SQLAlchemy
db = SQLAlchemy(main)

ROLE_USER = 1
ROLE_TEACHER = 0

class User(db.Model):
	__tablename__ = 'user'
	user_number = db.Column(db.Integer, primary_key = True)
	user_name = db.Column(db.String(255), nullable=False)
	user_password = db.Column(db.String(32), nullable=False)
    user_auth = db.Column(db.String(60), nullable=False)
	user_assignment = db.relationship('AuthAssignment', backref=db.backref('users'))

	def __init__(self, user_number, name, password):
		self.user_number  = id
		self.user_name = name
		self.user_password = self.set_password(password)

	def __repr__(self):
		return unicode(self.name).encode('utf-8')

	def md5(self, str):
		import hashlib
		m = hashlib.md5()
		m.update(str)
		print(m.hexdigest())
		return m.hexdigest()

	def set_password(self, password):
		return self.md5(password)

	def check_password(self, password):
		return (self.md5(password) == self.password)

	def is_authenticated(self):
		return False

	def is_active(self):
		return True

	def is_anonymous(self):
		return False

	def get_id(self):
		return unicode(self.id)

class AuthAssignment(db.Model):
	__tablename__ = 'auth_assignment'
	item_name = db.Column(db.Integer, nullable=True)
	user_id = db.Column(db.Integer, db.ForeignKey('user.user_number'), nullable=False)
    create_at = db.Column(db.Integer, nullable=True)

	##def __repr__(self):
		#return unicode(self.name).encode('utf-8')
