from flask import Blueprint, render_template, request, session
from rag.dj_setup import obter_fala
from utils.utils_functions import sortear_assunto, proxima_musica

bp = Blueprint('bp_projeto', __name__)

@bp.route('/')
def index():
    musica = proxima_musica()
    return render_template('index.html', musica=musica)


@bp.route("/chamar-dj")
def chamar_dj():
    assunto = sortear_assunto()
    fala = obter_fala(assunto)
    return fala


@bp.route("/proxima-musica")
def chamar_proxima_musica():
    dados_musica = proxima_musica()
    return dados_musica
