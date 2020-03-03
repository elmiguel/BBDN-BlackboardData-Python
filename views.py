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
from app_settings import QUERY_REPO, RAW_SQL_URL, RAW_VARS_URL


def setup_views(app):

    def allow_control_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    # @app.route('/<asset>/<path>')
    # def send_js(asset, path):
    #     print(f"{app.static_folder}/{asset}", path)
    #     return send_from_directory(f"{app.static_folder}/{asset}", path)

    @app.route('/', methods=['GET'])
    # @login_required
    def index():
        return send_from_directory('public', 'index.html')
        # return render_template('index.html')

    @app.route('/queries', methods=['GET'])
    # @login_required
    def queries():

        data = requests.get(
            'https://api.github.com/repos/elmiguel/BBDN-BlackboardData-Queries/contents').json()
        return jsonify(data)

    @app.route('/queries/<query_name>', methods=['GET'])
    # @login_required
    def query_by_name(query_name):
        print('query requested')
        varibles = requests.get(RAW_VARS_URL.replace(
            '{query_name}', query_name)).json()['variables']
        query = requests.get(RAW_SQL_URL.replace(
            '{query_name}', query_name)).text

        # ensure that if there are vars, then inject them into the query
        for key, value in varibles.items():
            print(key, value)
            query = query.replace('{' + key + '}', str(value))

        return jsonify({
            'query': query
        })

    @app.route('/test', methods=['GET'])
    # @login_required
    def test():
        return jsonify(
            {
                'headings': [
                    'Name',
                    'Company',
                    'Ext.',
                    'Start Date',
                    'Email',
                    'Phone No.'
                ],
                'data': [
                        [
                            'Hedwig F. Nguyen',
                            'Arcu Vel Foundation',
                            '9875',
                            '03/27/2017',
                            'nunc.ullamcorper@metusvitae.com',
                            '070 8206 9605'
                        ],
                    [
                            'Genevieve U. Watts',
                            'Eget Incorporated',
                            '9557',
                            '07/18/2017',
                            'Nullam.vitae@egestas.edu',
                            '0800 025698'
                        ],
                    [
                            'Kyra S. Baldwin',
                            'Lorem Vitae Limited',
                            '3854',
                            '04/14/2016',
                            'in@elita.org',
                            '0800 237 8846'
                        ],
                    [
                            'Stephen V. Hill',
                            'Eget Mollis Institute',
                            '8820',
                            '03/03/2016',
                            'eu@vel.com',
                            '0800 682 4591'
                        ],
                    [
                            'Vielka Q. Chapman',
                            'Velit Pellentesque Ultricies Institute',
                            '2307',
                            '06/25/2017',
                            'orci.Donec.nibh@mauriserateget.edu',
                            '0800 181 5795'
                        ],
                    [
                            'Ocean W. Curtis',
                            'Eu Ltd',
                            '6868',
                            '08/24/2017',
                            'cursus.et@cursus.edu',
                            '(016977) 9585'
                        ],
                    [
                            'Kato F. Tucker',
                            'Vel Lectus Limited',
                            '4713',
                            '11/06/2017',
                            'Duis@Lorem.edu',
                            '070 0981 8503'
                        ],
                    [
                            'Robin J. Wise',
                            'Curabitur Dictum PC',
                            '3285',
                            '02/09/2017',
                            'blandit@montesnascetur.edu',
                            '0800 259158'
                        ],
                    [
                            'Uriel H. Guerrero',
                            'Mauris Inc.',
                            '2294',
                            '02/11/2018',
                            'vitae@Innecorci.net',
                            '0500 948772'
                        ],
                    [
                            'Yasir W. Benson',
                            'At Incorporated',
                            '3897',
                            '01/13/2017',
                            'ornare.elit.elit@atortor.edu',
                            '0391 916 3600'
                        ],
                    [
                            'Shafira U. French',
                            'Nisi Magna Incorporated',
                            '5116',
                            '07/23/2016',
                            'metus.In.nec@bibendum.ca',
                            '(018013) 26699'
                        ],
                    [
                            'Casey E. Hood',
                            'Lorem Vitae Odio Consulting',
                            '7079',
                            '05/05/2017',
                            'justo.Praesent@sitamet.ca',
                            '0800 570796'
                        ],
                    [
                            'Caleb X. Finch',
                            'Elit Associates',
                            '3629',
                            '09/19/2016',
                            'condimentum@eleifend.com',
                            '056 1551 7431'
                        ]
                ]
            }
        )
