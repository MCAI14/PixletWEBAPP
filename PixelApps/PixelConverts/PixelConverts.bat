REM filepath: c:\Users\Programção do Misha\OneDrive\Ambiente de Trabalho\Base de MEO-DA8660\PixelCorporation\PixletWEBAPP\PixelApps\PixelConverts\PixelConverts.bat
@echo off
setlocal

echo Iniciando o conversor...

REM Verifica se FileConverter.class existe no diretório PixelConverts
if not exist "%~dp0FileConverter.class" (
    echo Arquivo FileConverter.class nao encontrado.
    echo Compilando FileConverter.java...
    javac "%~dp0PixelConverts\FileConverter.java"
    if errorlevel 1 (
        echo Erro na compilacao. Verifique o seu codigo fonte.
        pause
        exit /b 1
    )
)

REM Executa a classe compilada
java -cp "%~dp0" PixelConverts.FileConverter

pause