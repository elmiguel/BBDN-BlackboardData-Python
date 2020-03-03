from flask import redirect, request
from flask.templating import render_template
from flask_wtf import Form
from flask.helpers import flash, url_for, send_from_directory, send_file
from flask.json import jsonify
from flask_login import login_required, current_user, logout_user, login_user
from flask_restless import ProcessingException
import requests
from wtforms.fields.core import StringField
from wtforms.fields.simple import PasswordField, SubmitField
from app_settings import QUERY_REPO, RAW_SQL_URL, RAW_VARS_URL
from sample_data import SAMPLE_DATA
import json


def setup_views(app):

    def allow_control_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    # @app.route('/<asset>/<path>')
    # def send_js(asset, path):
    #     print(f"{app.static_folder}/{asset}", path)
    #     return send_from_directory(f"{app.static_folder}/{asset}", path)

    @app.route('/favicon.ico')
    def send_js():
        return send_from_directory('./', 'favicon.ico')

    @app.route('/', methods=['GET'])
    # @login_required
    def index():
        return send_from_directory('public', 'index.html')
        # return render_template('index.html')

    @app.route('/queries', methods=['GET'])
    # @login_required
    def queries():
        data = requests.get(QUERY_REPO).json()
        return jsonify(data)

    @app.route('/queries/<query_name>', methods=['GET'])
    # @login_required
    def query_by_name(query_name):
        print('query requested')
        variables = requests.get(RAW_VARS_URL.replace(
            '{query_name}', query_name)).json()['variables']
        query = requests.get(RAW_SQL_URL.replace(
            '{query_name}', query_name)).text
        # print(json.dumps(varibles, indent=4))

        # ensure that if there are vars, then inject them into the query
        for key, value in variables.items():
            print(key, value)
            query = query.replace('{' + key + '}', str(value))

        return jsonify({
            'query': query
        })

    @app.route('/test', methods=['GET'])
    # @login_required
    def test():
        return jsonify(SAMPLE_DATA)
