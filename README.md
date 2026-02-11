# ☢️ Sintonia Wasteland ☢️

> *"Porque um post-apocalipse sem música é apenas... o apocalipse."*

## 📺 Sobre o Projeto

**Sintonia Wasteland** é uma rádio web imersiva baseada no universo de **Fallout**. O projeto simula a interface de um **Pip-Boy 3000** e traz a experiência das rádios do *Fallout 3*, *Fallout: New Vegas*, *Fallout 4* e *Fallout 76* para o navegador.

Entre as músicas, a IA assume o controle na pele do DJ **Three Dog**. Através do **Google Gemini** e contexto via **RAG** (*Retrieval-Augmented Generation*), o sistema gera roteiros de fala dinâmicos, cobrindo desde o Mojave até a Capital Wasteland, e utiliza síntese de voz para narrar esses textos, simulando uma transmissão ao vivo onde o apresentador reage ao conteúdo da rádio.

---

## 🛠️ Tecnologias Utilizadas

* **Back-end:** Python e Flask
* **Front-end:** HTML5, CSS e JavaScript
* **IA:** Google Gemini e LangChain
* **Banco de dados:** MySQL
* **Conteinerização:** Docker

---

## 🚀 Instalação e Configuração

Siga os passos abaixo para colocar a rádio no ar.

### 1. Pré-requisitos
* [Docker](https://www.docker.com/) e Docker Compose instalados.
* Uma chave de API do [Google AI Studio (Gemini)](https://aistudio.google.com/).

### 2. Clonar o repositório

```bash
git clone https://github.com/PedroLovatto99/sintonia-wasteland.git
cd sintonia-wasteland
```

### 3. Configurar Variáveis de Ambiente (.env)

Crie um arquivo chamado `.env` na raiz do projeto. Este arquivo guardará suas chaves secretas e configurações do banco de dados.

Copie e cole o modelo abaixo, preenchendo com seus dados:

```ini
# Gere sua chave em: https://aistudio.google.com/
GOOGLE_API_KEY=sua_chave_do_google_aqui

# --- Segurança do Flask ---
# Pode ser qualquer texto aleatório
SECRET_KEY=uma_chave_secreta_super_segura

# --- Configurações do Banco de Dados (MySQL) ---
# Defina o usuário e senha que o Docker vai criar
DB_USUARIO=root
DB_SENHA=sua_senha_mysql
DB_NOME=nome_do_banco
```

### 4. Rodar com Docker (Recomendado)

O projeto já está containerizado. Para subir a aplicação e o banco de dados MySQL simultaneamente, execute:

```bash
docker-compose up --build
```
⚠️ IMPORTANTE: O processo irá demorar um pouco por conta da quantidade de bibliotecas e por conta da configuração do RAG.

### 5. Para acessar
Abra o seu navegador e acesse:
```bash
http://localhost:5000
```
Clique na tela ***"PLEASE STAND BY"*** para iniciar a rádio.
