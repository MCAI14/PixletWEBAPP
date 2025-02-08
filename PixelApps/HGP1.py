import time

print("-----------------------------------Obrigado por descarregar o meu jogo! Espero que se divirta a aprender!-----------------------------------")
print("Olá! Bem-vindo ao primeiro quizz de História e Geografia de Portugal de 6ºano!")
name = input("Mas, primeiro, vou precisar de saber o teu nome! Por favor escreve-o aqui: ")
print(f"Vamos começar, {name}!")

# Pergunta 1

ask = input("Pergunta 1: Qual é a capital de Portugal? \nA) Lisboa \nB) Porto \nC) Coimbra \nD) Faro \nEscreve a letra da resposta correta: ")
if ask == "A" or ask == "a":
    print("Parabéns! Acertaste!")
    score = 1  
else:
    print("Resposta errada! A resposta correta é A) Lisboa.")

# Pergunta 2

ask = input("Pergunta 2: Qual a ordem de ancontecimentos no terramoto de 1755? \nA) Um terramoto, um tsunami e um incêndio. \nB) Um terramoto, um incêndio e um tsunami. \nC) Um tsunami, um terramoto e um incêndio. \nD) Um incêndio, um tsunami e um terramoto. \nEscreve a letra da resposta correta: ")

if ask == "B" or ask == "b":
    print("Parabéns! Acertaste!")
    score += 1
else:
    print("Resposta errada! A resposta correta é B) Um terramoto, um incêndio e um tsunami.")

# Pergunta 3

ask = input("Pergunta 3: Quem foi o rei que reconstruiu Lisboa após o terramoto de 1755? \nA) D. José I \nB) D. João V \nC) D. João VI \nD) D. João I \nEscreve a letra da resposta correta: ")

if ask == "A" or ask == "a":
    print("Parabéns! Acertaste!")
    score += 1
else:  
    print("Resposta errada! A resposta correta é A) D. José I.")

# Pergunta 4

ask = input("Pergunta 4: Qual era o cognome de D. João V? \nA) O Conquistador \nB) O Venturoso \nC) O Magnânimo \nD) O Prudente \nEscreve a letra da resposta correta: ")

if ask == "C" or ask == "c":
    print("Parabéns! Acertaste!")
    score += 1
else:
    print("Resposta errada! A resposta correta é C) O Magnânimo.")

# Thanks the player for playing and shows the score

print(f"Obrigado por jogares, {name}! O teu resultado final é {score} em 4 perguntas.")
print("Espero que te tenhas divertido a jogar o meu quizz! Podes ver mais no meu site. Até à próxima!")
print("Espera 30 segundos para o jogo fechar automaticamente.")
print("------------------------------------------------------------------------------------------------------------------------------------------")

# Pause for 30 seconds before closing
time.sleep(30)
