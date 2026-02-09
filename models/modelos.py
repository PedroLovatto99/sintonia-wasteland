from database.db_config import db

class musicaHistorico(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome_musica = db.Column(db.String(100), nullable=False)
    artista = db.Column(db.String(100), nullable=False)
    duracao = db.Column(db.Integer, nullable=False)
    url = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return '<Name %r' % self.nome_musica