from flask import Blueprint, render_template, request, session
from rag.dj_setup import obter_fala
from models.modelos import musicaHistorico
from utils.utils_functions import sortear_assunto, sortear_musica
from database.db_config import db

bp = Blueprint('bp_projeto', __name__)

@bp.route('/')
def index():
    musica_inicial = proxima_musica()
    return render_template('index.html', musica=musica_inicial)


@bp.route("/chamar-dj")
def chamar_dj():
    assunto = sortear_assunto()
    fala = obter_fala(assunto)
    return fala


@bp.route("/proxima-musica")
def proxima_musica():
    
    while True:
        musica = sortear_musica()
        nome_musica = musica["nome_musica"]
        historico = musicaHistorico.query.filter_by(nome_musica=nome_musica).first()

        if historico is None:
            break


    total_musicas = musicaHistorico.query.count()
    
    if total_musicas >= 10:
        primeiro_lista = musicaHistorico.query.order_by(musicaHistorico.id.asc()).first()
        if primeiro_lista:
            db.session.delete(primeiro_lista)
        
    nome_musica = musica["nome_musica"]
    artista = musica["artista"]
    duracao = musica["duracao"]
    url = musica["url"]

    nova_musica = musicaHistorico(nome_musica=nome_musica, 
                                    artista=artista, duracao=duracao, url=url)
    
    
    db.session.add(nova_musica)
    db.session.commit()

    return musica
