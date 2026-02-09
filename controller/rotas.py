from flask import Blueprint, render_template, request
from rag.dj_setup import obter_fala
import random

bp = Blueprint('bp_projeto', __name__)

@bp.route('/')
def index():
    return render_template('index.html')