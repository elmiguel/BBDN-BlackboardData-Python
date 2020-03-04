import datetime
from flask import current_app, _app_ctx_stack as stack
# import re
from json import JSONEncoder
import json
import os
import snowflake.connector
import pandas as pd
from pathlib import Path
import Config as cfg

APP_ROOT = os.getcwd()
# pd.set_option('display.max_rows', 10)


class MyEncoder(JSONEncoder):
    def default(self, obj):
        # return obj.__dict__
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        elif isinstance(obj, datetime.date):
            return obj.isoformat()
        elif isinstance(obj, datetime.timedelta):
            return (datetime.datetime.min + obj).time().isoformat()
        else:
            return super(MyEncoder, self).default(obj)


class BbDataTool(object):

    def __init__(self, app=None):
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        # setup app tools variables with default values
        app.config.setdefault('SFCONNECTION', app.config['SFCONFIG'])

        app.extensions['bb_data_db'] = self

        app.teardown_appcontext(self.teardown)

    @staticmethod
    def teardown(exception):
        ctx = stack.top
        if hasattr(ctx, 'bb_data_db'):
            ctx.bb_data_db.close()

    @property
    def connection(self, **options):
        print('am i being called')
        # if options['env'] == 'prod':
        #     # do prod connection - remove pass!
        #     pass
        # else:
        #     # do dev connection, with dev output logging - remove pass!
        #     pass

        ctx = stack.top
        if ctx is not None:
            if not hasattr(ctx, 'bb_data_db'):
                ctx.bb_data_db = self.get_connector()
            return ctx.bb_data_db

    def load_sql_file(self, filename):
        return Path(APP_ROOT) / 'queries' / f"{filename}.sql"

    def get_connector(self):
        print('connecting to snowflake')
        return snowflake.connector.connect(
            user=current_app.config['SFCONFIG']['user'],
            password=current_app.config['SFCONFIG']['password'],
            account=current_app.config['SFCONFIG']['account'],
            warehouse=current_app.config['SFCONFIG']['warehouse'],
            database=current_app.config['SFCONFIG']['database'],
            insecure_mode=current_app.config['SFCONFIG']['insecure_mode'],
        )

    def run_query_from_file(self, query_name, config=None):
        ctx = self.get_connector()
        cur = ctx.cursor()
        sql = load_sql_file(query_name).read_text()

        if config and config['params']:
            for key, value in config['params'].items():
                sql = sql.replace('{' + key + '}', value)
        print(sql)

        try:
            data = pd.read_sql(sql, ctx)
            # TODO: Fix this for later, use read_sql() for now
            # fetch_pandas_all() causing segfault on linux....???
            # 1]    32279 segmentation fault (core dumped)  python3 ./bbdn_utils.py
            # print(data)
            # cur.execute(sql)
            # df = cur.fetch_pandas_all()
            # print(df.head())
            if config and config['config']:
                data.to_csv(config['config']['outfile'],
                            index=config['config']['index'])
                return data.to_json(orient='split')
            else:
                print(data)
        finally:
            cur.close()

        ctx.close()

    def run_query(self, sql, config=None):
        ctx = self.get_connector()
        cur = ctx.cursor()
        try:
            data = pd.read_sql(sql, ctx)
            # TODO: Fix this for later, use read_sql() for now
            # fetch_pandas_all() causing segfault on linux....???
            # 1]    32279 segmentation fault (core dumped)  python3 ./bbdn_utils.py
            # print(data)
            # cur.execute(sql)
            # df = cur.fetch_pandas_all()
            # print(df.head())
            if config and config['config']:
                data.to_csv(config['config']['outfile'],
                            index=config['config']['index'])
                return data.to_json(orient='split')
            else:
                print(data)
                return json.loads((data.to_json(orient='split')))
        finally:
            cur.close()

        ctx.close()
