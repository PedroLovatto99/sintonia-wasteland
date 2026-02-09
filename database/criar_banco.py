import mysql.connector
from mysql.connector import errorcode
import sys
import os

db_host = os.getenv('DB_HOST', 'localhost')

print("Conectando...")
try:
    conn = mysql.connector.connect(
        host=db_host,
        user='root',
        password='mlovatto'
    )
except mysql.connector.Error as err:
      if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print('Existe algo errado no nome de usuário ou senha')
      else:
            print(err)
            sys.exit()

cursor = conn.cursor()

cursor.execute("DROP DATABASE IF EXISTS `sintoniadb`;")

cursor.execute("CREATE DATABASE `sintoniadb`;")

cursor.execute("USE `sintoniadb`;")

TABLES = {}
TABLES['musica_historico'] = ('''
      CREATE TABLE `musica_historico` (
      `id` INT NOT NULL AUTO_INCREMENT,
      `nome_musica` VARCHAR(100) NOT NULL,
      `artista` VARCHAR(100) NOT NULL,
      `duracao` INT NOT NULL,
      `url` VARCHAR(200) NOT NULL,             
      PRIMARY KEY (`id`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;''')


for tabela_nome in TABLES:
      tabela_sql = TABLES[tabela_nome]
      try:
            print('Criando tabela {}:'.format(tabela_nome), end=' ')
            cursor.execute(tabela_sql)
      except mysql.connector.Error as err:
            if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                  print('Já existe')
            else:
                  print(err.msg)
      else:
            print('OK')


conn.commit()

cursor.close()
conn.close()
