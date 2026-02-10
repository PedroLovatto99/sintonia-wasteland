import random
import json
from models.modelos import musicaHistorico
from database.db_config import db

def sortear_assunto():
    topico = random.choice(["Notícia", "Sobrevivência", "Fofoca", "Propaganda"])
    return topico

def sortear_musica():
    with open("dados.json", "r", encoding="utf-8") as arquivo:
        dados = json.load(arquivo)
    
    musica = random.choice(dados)
    return musica

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
