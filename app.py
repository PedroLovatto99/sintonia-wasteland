from flask import Flask
from database.db_config import db
from rag.dj_setup import iniciar_sistema


app = Flask(__name__)
app.config.from_pyfile('database/db_config.py')
db.init_app(app)
iniciar_sistema()

from controller.rotas import bp
app.register_blueprint(bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)