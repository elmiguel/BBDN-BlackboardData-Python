from flask import Flask
# from flask.ext.cors.extension import CORS
from flask_cors import CORS
# from flask_login import LoginManager
from flask_loopback import FlaskLoopback
from flask_restless import APIManager
from werkzeug.datastructures import Authorization
from app_settings import SECRET_KEY

# =============================
# TODO: Migrate these over to view.py
# =============================
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
# =============================
# =============================

app = Flask(__name__, static_url_path='/public')
app.config.from_object('app_settings')
app.secret_key = SECRET_KEY
# login_manager = LoginManager()
# login_manager.init_app(app)
cors = CORS(app, allow_headers=[Authorization])
loopback = FlaskLoopback(app)

# TODO: Setup views, models, apis


def allow_control_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


@app.route('/', methods=['GET'])
# @login_required
def index():
    return send_from_directory('public', 'index.html')
    # return render_template('index.html')


# from models import *

# api_manager = APIManager(app,
#                          flask_sqlalchemy_db=db,
#                          preprocessors=dict(
#                                               # GET=[auth_func], GET_SINGLE=[auth_func], GET_MANY=[auth_func],
#                                               POST=[auth_func], POST_SINGLE=[auth_func], POST_MANY=[auth_func],
#                                               PATCH=[auth_func], PATCH_SINGLE=[auth_func], PATCH_MANY=[auth_func],
#                                               DELETE=[auth_func], DELETE_SINGLE=[auth_func], DELETE_MANY=[auth_func])
#                          )

# api_manager.create_api(User,
#                        methods=['GET', 'POST', 'PATCH', 'DELETE'],
#                        exclude_columns=['password'],
#                        postprocessors=dict(GET=[get_postprocessor],
#                                            GET_SINGLE=[get_postprocessor],
#                                            GET_MANY=[get_postprocessor])
#                        )
