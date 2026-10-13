import re
import unicodedata

def normalizar(texto):
    return "".join(c for c in unicodedata.normalize("NFD", texto.lower()) if not unicodedata.combining(c))

def refletir(texto):
    trocas = {"eu": "você", "meu": "seu", "minha": "sua", "meus": "seus", "minhas": "suas",
              "sou": "é", "estou": "está", "tenho": "tem", "voce": "eu", "seu": "meu", "sua": "minha"}
    return re.sub(r"\b\w+\b", lambda m: trocas.get(normalizar(m.group()), m.group()), texto)

class Eliza:
    def __init__(self):
        self.encerrada = False
        self.turno = 0

    def responder(self, texto):
        if self.encerrada:
            return "Conversa encerrada. Clique em Nova conversa."
        texto = texto.strip()
        if not texto:
            return "Escreva uma frase para começarmos."
        n = normalizar(texto)
        if n in ["sair", "tchau", "adeus"]:
            self.encerrada = True
            return "Até mais! Obrigada pela conversa."
        if re.search(r"\b(oi|ola)\b", n):
            return "Olá! Sou uma ELIZA didática, um programa de regras. Sobre o que quer conversar?"
        for padrao, resposta in [
            (r"\beu preciso (.+)", "Por que você precisa {trecho}?"),
            (r"\beu sinto (.+)", "O que faz você sentir {trecho}?"),
            (r"\beu estou (.+)", "Há quanto tempo você está {trecho}?"),
            (r"\beu sou (.+)", "O que significa para você ser {trecho}?"),
            (r"\bporque (.+)", "Essa é a única razão: {trecho}?"),
        ]:
            achado = re.search(padrao, n)
            if achado:
                # A normalização mantém os índices das letras portuguesas usuais.
                trecho = texto[achado.start(1):achado.end(1)].rstrip(".!?")
                trecho = refletir(trecho)
                if "precisa {trecho}" in resposta and not re.match(r"^(de|do|da|dos|das)\b", normalizar(trecho)):
                    trecho = "de " + trecho
                return resposta.format(trecho=trecho)
        if re.search(r"\b(mae|pai|familia|irmao|irma)\b", n):
            return "Pode me contar mais sobre sua família?"
        if re.search(r"\b(python|programacao|codigo)\b", n):
            return "Que parte da programação você está aprendendo?"
        respostas = ["Pode dar um exemplo?", "O que você pensa sobre isso?", "Conte um pouco mais."]
        resposta = respostas[self.turno % len(respostas)]
        self.turno += 1
        return resposta

if __name__ == "__main__":
    import html
    import ipywidgets as w
    from IPython.display import display
    try:
        from google.colab import output
        output.enable_custom_widget_manager()
    except ImportError:
        pass
    eliza = Eliza()
    historico_eliza = []
    conversa_eliza = w.HTML()
    entrada_eliza = w.Textarea(description="Você:", placeholder="Digite sua mensagem…", layout=w.Layout(width="95%"))
    enviar_eliza = w.Button(description="Enviar")
    nova_eliza = w.Button(description="Nova conversa")

    def atualizar_eliza():
        conversa_eliza.value = '<h3>ELIZA didática</h3><p>Bot por regras inspirado em ELIZA. Não é uma LLM nem um serviço de aconselhamento.</p><div style="max-height:300px;overflow:auto">' + "".join(
            f'<p><b>{autor}:</b> {html.escape(texto)}</p>' for autor, texto in historico_eliza[-60:]) + '</div>'

    def enviar_mensagem(_):
        texto = entrada_eliza.value.strip()
        if not texto:
            return
        historico_eliza.append(("Você", texto))
        historico_eliza.append(("ELIZA", eliza.responder(texto)))
        entrada_eliza.value = ""
        atualizar_eliza()

    def nova_conversa(_):
        global eliza
        eliza = Eliza()
        historico_eliza.clear()
        historico_eliza.append(("ELIZA", "Olá! Digite uma frase. Para encerrar, escreva sair."))
        entrada_eliza.value = ""
        atualizar_eliza()

    enviar_eliza.on_click(enviar_mensagem)
    nova_eliza.on_click(nova_conversa)
    display(w.VBox([conversa_eliza, entrada_eliza, w.HBox([enviar_eliza, nova_eliza])]))
    nova_conversa(None)
