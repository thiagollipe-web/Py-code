peca = [[0, 1, 0], [1, 1, 1]]
for linha in peca:
    desenho = ""
    for bloco in linha:
        desenho += "[]" if bloco else "  "
    print(desenho)
