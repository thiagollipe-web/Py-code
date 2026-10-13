import re

def responder(frase):
    palavras = re.findall(r"\w+", frase.lower())
    if "lista" in palavras:
        return "Use [ ] para criar uma lista."
    if "oi" in palavras:
        return "Olá, estudante!"
    return "Me conte mais."

print(responder("como criar lista?"))
print(responder("Oi!"))
print(responder("coisa"))
