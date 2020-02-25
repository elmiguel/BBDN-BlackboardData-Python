import datetime
from flask import current_app
from flask import _app_ctx_stack as stack
# import httplib2
# import re
from json import JSONEncoder


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
        # app.config.setdefault('VAR_NAME', DEFAULT_VALUE)

        app.extensions['bb_data_tool'] = self

        app.teardown_appcontext(self.teardown)

    @staticmethod
    def teardown(exception):
        ctx = stack.top
        if hasattr(ctx, 'bb_data_tool'):
            ctx.bb_data_tool.unbind()

    @property
    def connection(self, **options):

        if options['env'] == 'prod':
            # do prod connection - remove pass!
            pass
        else:
            # do dev connection, with dev output logging - remove pass!
            pass

        ctx = stack.top
        if ctx is not None:
            if not hasattr(ctx, 'bb_data_tool'):
                # do some sort of call here - remove pass!
                # ctx.bb_data_tool = self.post_data(**args)
                pass
            return ctx.bb_data_tool

    @staticmethod
    def lower_params(params):
        if len(params) is 0:
            return None
        return [p.lower() for p in params]

    @staticmethod
    def title_params(params):
        if len(params) is 0:
            return None
        return [p.title() for p in params]

    # example of tool functions
    # def post_data(self, username, password, url, data):
    #     h = httplib2.Http()
    #     h.add_credentials(username, password)
    #     content_type = "text/plain"

    #     if self.isXML:
    #         content_type = "text/xml"
    #     resp, content = h.request(url, "POST", body=data, headers={
    #                               "content-type": content_type})
    #     print(resp)
    #     print(content)
    #     reference_code = re.search(r"(\w{32})", str(content)).group(0)
    #     self.reference_code = reference_code
    #     return reference_code
