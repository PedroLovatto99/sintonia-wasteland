import random
import json

def sortear_assunto():
    topico = random.choice(["Notícia", "Sobrevivência", "Fofoca", "Propaganda"])
    return topico

def sortear_musica():
    with open("dados.json", "r", encoding="utf-8") as arquivo:
        dados = json.load(arquivo)
    
    musica = random.choice(dados)
    return musica