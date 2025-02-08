import webbrowser
import time

print("Sê bem-vindo ao K Runner!")
print("A ligar aos servidores...")
time.sleep(4)
print("Conectado com sucesso!")

# URL para a qual você quer redirecionar
url = "https://www.msn.com/pt-pt/noticias"
# Abre o navegador padrão e redireciona para a URL
webbrowser.open(url)

# Mantém a janela aberta até que o usuário pressione Enter
input("Pressiona Enter para sair...")