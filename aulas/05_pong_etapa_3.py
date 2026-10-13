limite_esquerdo = 0
limite_direito = 5
bola = 2
velocidade = 1
for tempo in range(1, 11):
    bola = bola + velocidade
    if bola >= limite_direito:
        bola = limite_direito
        velocidade = -abs(velocidade)
    elif bola <= limite_esquerdo:
        bola = limite_esquerdo
        velocidade = abs(velocidade)
    print("Passo", tempo, "posição", bola, "direção", velocidade)
