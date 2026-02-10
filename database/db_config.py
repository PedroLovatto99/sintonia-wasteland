from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()

SECRET_KEY = os.getenv('SECRET_KEY')
db_host = os.getenv('DB_HOST', 'localhost')

SQLALCHEMY_DATABASE_URI = \
'{SGBD}://{usuario}:{senha}@{servidor}/{database}'.format(
    SGBD = 'mysql+mysqlconnector',
    usuario = os.getenv('DB_USUARIO'),
    senha = os.getenv('DB_SENHA'),
    servidor = db_host,
    database = os.getenv('DB_NOME'),
)
