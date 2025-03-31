import subprocess
import sys

# Função para instalar pacotes
def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# Instalar pacotes necessários
install("pyttsx3")
install("SpeechRecognition")
install("pyautogui")
install("pypiwin32")
install("pywin32")

import pyttsx3
import speech_recognition as sr
import pyautogui

# Inicializar o motor de síntese de fala
engine = pyttsx3.init()

def speak(text):
    engine.say(text)
    engine.runAndWait()

def listen():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        audio = recognizer.listen(source)
        try:
            command = recognizer.recognize_google(audio, language='pt-BR')
            print(f"You said: {command}")
            return command.lower()
        except sr.UnknownValueError:
            print("Sorry, I did not understand that.")
            return ""
        except sr.RequestError:
            print("Sorry, my speech service is down.")
            return ""

def execute_command(command):
    if "abrir navegador" in command:
        speak("Abrindo o navegador")
        pyautogui.hotkey('win', 'r')
        pyautogui.write('chrome')
        pyautogui.press('enter')
    elif "que horas são" in command:
        from datetime import datetime
        now = datetime.now().strftime("%H:%M")
        speak(f"Agora são {now}")
    else:
        speak("Desculpe, não entendi o comando.")

if __name__ == "__main__":
    speak("Como posso ajudar?")
    while True:
        command = listen()
        if command:
            execute_command(command)