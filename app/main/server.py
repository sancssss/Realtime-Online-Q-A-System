from flask import render_template
from . import main

@main.route('/')
def index():
    """Online Assginment index page route"""
    return render_template('index.html')
