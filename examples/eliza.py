# ELIZA didática: padrões e perguntas, sem LLM.
import re
import unicodedata


def normalizar(texto):
    texto = unicodedata.normalize("NFD", texto.lower())
    return "".join(c for c in texto if not unicodedata.combining(c)).strip()


def refletir(texto):
    trocas = {"eu": "você", "meu": "seu", "minha": "sua",
              "meus": "seus", "minhas": "suas", "mim": "você"}
    return re.sub(r"\b\w+\b", lambda m: trocas.get(m[0], m[0]), texto)


def responder(frase):
    frase = normalizar(frase).rstrip(".!?")
    regras = [
        (r"(?:eu )?sinto (.+)", "O que faz você sentir {}?"),
        (r"(?:eu )?estou (.+)", "Há quanto tempo você está {}?"),
        (r"(?:eu )?sou (.+)", "O que faz você dizer que é {}?"),
        (r"(?:eu )?quero (.+)", "Por que você quer {}?"),
        (r"(?:eu )?nao consigo (.+)", "O que dificulta {}?"),
        (r"porque (.+)", "Essa é a única razão para {}?"),
    ]
    for padrao, pergunta in regras:
        resultado = re.fullmatch(padrao, frase)
        if resultado:
            return pergunta.format(refletir(resultado[1]))
    if re.search(r"\b(oi|ola)\b", frase):
        return "Olá! Sobre o que você quer conversar?"
    return "Pode explicar melhor ou dar um exemplo?"


print("ELIZA: Olá! Sou um bot de regras. Digite sair para encerrar.")
try:
    while True:
        frase = input("Você: ").strip()
        if normalizar(frase) == "sair":
            print("ELIZA: Até a próxima!")
            break
        if frase:
            print("ELIZA:", responder(frase))
except (EOFError, KeyboardInterrupt):
    print("\nELIZA: Conversa encerrada.")
