import random

def generate_random_hash(n:int=8):
    letters = list("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_@#")
    letras_aleatorias = random.choices(letters, k=n)
    return "".join(letras_aleatorias)