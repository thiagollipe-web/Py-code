import re

def bot(frase):
    palavras = re.findall(r"\w+", frase.lower())
    if "erro" in palavras:
        return "Leia a última linha do erro."
    if "python" in palavras:
        return "Python é uma linguagem de programação."
    return "Quer estudar listas ou jogos?"

perguntas = ["O que é Python?", "Deu erro"]
for pergunta in perguntas:
    print("Você:", pergunta)
    print("Bot:", bot(pergunta))
