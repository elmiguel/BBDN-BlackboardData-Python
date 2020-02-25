from flask import redirect, request
from flask.templating import render_template
from flask_wtf import Form
from flask.helpers import flash, url_for, send_from_directory
from flask.json import jsonify
from flask_login import login_required, current_user, logout_user, login_user
from flask_restless import ProcessingException
import requests
from wtforms.fields.core import StringField
from wtforms.fields.simple import PasswordField, SubmitField


def allow_control_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


@app.route('/', methods=['GET'])
@login_required
def index():
    return render_template('index.html')
