bola = 4
velocidade = 1
limite_direito = 5
bola = bola + velocidade
if bola >= limite_direito:
    bola = limite_direito
    velocidade = -abs(velocidade)
print("Posição:", bola)
print("Direção:", velocidade)
