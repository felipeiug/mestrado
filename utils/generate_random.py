import random

def generate_random_hash(n:int=8):
    letters = list("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890")
    letras_aleatorias = random.choices(letters, k=n)
    return "".join(letras_aleatorias)

def generate_random_color(hight=True):
    if hight:
        letters = list("0123456789ABCDEF")
    else:
        letters = list("0123456789AB")

    cor = random.choices(letters, k=6)
    return "#" + "".join(cor)