from flask import Flask

from api.tickets import ticket_api
from api.messages import message_api

from db import init_db
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the database
init_db()

# Register blueprints
app.register_blueprint(ticket_api) 
app.register_blueprint(message_api)


if __name__ == "__main__":
    app.run(debug=True)