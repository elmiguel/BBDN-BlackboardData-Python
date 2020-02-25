#!./venv/bin/python

from BbDataApp import app
from flipflop import WSGIServer

if __name__ == '__main__':
    if app.debug:
        print(f"Debugging Mode: {app.config['DEBUG']}")
        print("Application is running...")
        app.run()
    else:
        WSGIServer(app).run()
