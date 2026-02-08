import os
import time
from dotenv import load_dotenv
import threading
import random

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

chain = None
is_ready = False

FRASES_ESPERA = [
    "Atenção Wasteland! Estamos passando por problemas técnicos",
     "Deve ter um supermutante mexendo na antena. Por favor, aguarde alguns segundos"
    ]


def inicializar_radialista():

    global chain, is_ready

    PERSIST_DIR = "./chroma_db"
    PDF_FILE = "dados.pdf"
    embedding_model = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

    if os.path.exists(PERSIST_DIR) and os.listdir(PERSIST_DIR):
        vectorstore = Chroma(persist_directory=PERSIST_DIR, embedding_function=embedding_model)

    else:
        loader = PyPDFLoader(PDF_FILE)
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)
        print(f"Total de pedaços para processar: {len(splits)}")

        vectorstore = Chroma(
            embedding_function=embedding_model,
            persist_directory=PERSIST_DIR
        )

        batch_size = 20
        total_docs = len(splits)
        
        for i in range(0, total_docs, batch_size):
            batch = splits[i : i + batch_size]
            
            sucesso = False
            while not sucesso:
                try:
                    print(f"Processando lote {i} a {min(i + batch_size, total_docs)}...")
                    vectorstore.add_documents(batch)
                    sucesso = True
                    time.sleep(2)
                except Exception as e:
                    if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                        print("⏳ Cota excedida. Esperando 60 segundos para limpar...")
                        time.sleep(60)
                    else:
                        raise e

    retriever = vectorstore.as_retriever()

    llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0.8)

    template = """
    Você é o Three Dog, o DJ da Galaxy News Radio. 
    Sua missão é manter a Wasteland informada e entretida.

    CONTEXTO RECUPERADO (Use isso como base para sua notícia):
    {context}

    TÓPICO DO OUVINTE:
    {assunto}

    DIRETRIZES:
    1. Use o CONTEXTO para criar rumores, fofocas ou dicas de sobrevivência, dependendo do que vier de assunto.
    2. Não leia o texto como uma enciclopédia ou professor de história! Transforme em uma história de rua, tente acrescentar humor quando possível.
    3. Se o texto fala de um monstro, dê uma dica de como matá-lo ou fugir dele.
    4. Se o texto fala de uma facção, invente uma fofoca sobre o líder ou soldado.
    5. Se o contexto falar de animal, fale uma receita envolvendo a carne dele ou os ovos.
    6. Fale gírias de Fallout (Ghoul, smoothskin, rads, caps).
    7. Não traduza novos como New Vegas, New California Republica, Strip.

    Exemplo: Se o contexto fala que "Ghouls sofrem necrose", você diz: "Ei ouvintes, cuidado com os Ghouls em decomposição! O cheiro entrega eles a quilômetros!"
    """

    prompt = PromptTemplate.from_template(template)

    chain = (
        {"context": retriever, "assunto": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

def iniciar_sistema():
    
    if is_ready:
        return
    
    thread_dj = threading.Thread(target=inicializar_radialista, daemon=True)
    thread_dj.start()


def obter_fala(assunto):
    if not is_ready:
        return random.choice(FRASES_ESPERA)
    
    return chain.invoke(assunto)