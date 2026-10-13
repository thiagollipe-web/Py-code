cobra = [(2, 2), (1, 2), (0, 2)]
for passo in range(3):
    x, y = cobra[0]
    cobra.insert(0, (x + 1, y))
    cobra.pop()
    print("Passo", passo + 1, cobra)
