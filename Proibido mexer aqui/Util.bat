@echo off

REM Verificar se o arquivo de controle existe
if exist C:\temp\controle.txt (
    type C:\temp\controle.txt
    del C:\temp\controle.txt
    pause
)

color 0A
mode 800
:loop
REM Alterar a cor do texto aleatoriamente
set /a color=%random% %% 16
color 0%color%

REM Alterar o título da janela do prompt de comando aleatoriamente
set /a title=%random% %% 3
if %title%==0 title Hackeado!
if %title%==1 title Erro Fatal!
if %title%==2 title Surpresa!

REM Mostrar mensagens diferentes aleatoriamente
set /a msg=%random% %% 3
if %msg%==0 (
    REM Efeito de digitação lenta
    setlocal enabledelayedexpansion
    set "message=Foste hackeado!"
    for /l %%i in (0,1,14) do (
        set "char=!message:~%%i,1!"
        <nul set /p=!char!
        ping localhost -n 2 >nul
    )
    echo.
    endlocal
)
if %msg%==1 echo Oops! Algo deu errado!
if %msg%==2 echo Surpresa! Hackeado de novo!

REM Adicionar sons de alerta
echo ^G

REM Reproduzir sons usando o comando powershell
powershell -c (New-Object Media.SoundPlayer "C:\Windows\Media\chimes.wav").PlaySync();

REM Abrir múltiplas janelas do prompt de comando
start cmd /c "echo Foste hackeado! & timeout /t 5 >nul"

REM Abrir sites aleatórios no navegador
set /a site=%random% %% 3
if %site%==0 start https://example.com
if %site%==1 start https://example.org
if %site%==2 start https://example.net

REM Alterar o tamanho da janela do prompt de comando
mode con: cols=120 lines=30

REM Efeito de texto piscando
set /a blink=%random% %% 2
if %blink%==0 echo.
if %blink%==1 echo Foste hackeado!

REM Reproduzir um som de alerta contínuo
powershell -c (New-Object Media.SoundPlayer "C:\Windows\Media\alarm01.wav").PlayLooping();

REM Abrir o bloco de notas com uma mensagem
echo Foste hackeado! > temp.txt
start notepad temp.txt

REM Criar arquivo de controle
echo Eu avisei-te! > C:\temp\controle.txt

REM Reiniciar o computador após um tempo
shutdown -r -t 60 -c "O seu computador será morto em 1 minuto!"

timeout /t 1 >nul
cls
timeout /t 1 >nul

REM Condição para parar o loop
set /p stop="Pressione algo para parar o script: "
if /i "%stop%"=="s" exit

goto loop