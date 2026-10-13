cobra = [(2, 2), (1, 2), (0, 2)]
x, y = cobra[0]
cobra.insert(0, (x + 1, y))
cobra.pop()
print(cobra)
