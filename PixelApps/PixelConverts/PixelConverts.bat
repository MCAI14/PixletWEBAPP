REM filepath: c:\Users\Programção do Misha\OneDrive\Ambiente de Trabalho\Base de MEO-DA8660\PixelCorporation\PixletWEBAPP\PixelApps\PixelConverts\PixelConverts.bat
@echo off
echo Verificando instalacao do Java...

java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Java nao encontrado. Iniciando download do instalador...
    
    :: Download do OpenJDK
    powershell -Command "(New-Object Net.WebClient).DownloadFile('https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.8.1%2B1/OpenJDK17U-jre_x64_windows_hotspot_17.0.8.1_1.msi', 'jre_installer.msi')"
    
    echo Instalando Java...
    msiexec /i jre_installer.msi /quiet /qn
    
    echo Aguarde a instalacao concluir...
    timeout /t 30 /nobreak
    
    del jre_installer.msi
    
    echo Instalacao do Java concluida!
)

:: Criar atalho no ambiente de trabalho
echo Criando atalho no ambiente de trabalho...
set SCRIPT="%TEMP%\CreateShortcut.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") > %SCRIPT%
echo sLinkFile = oWS.ExpandEnvironmentStrings("%%USERPROFILE%%\Desktop\PixelConverter.lnk") >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%~dp0PixelConverts.bat" >> %SCRIPT%
echo oLink.WorkingDirectory = "%~dp0" >> %SCRIPT%
echo oLink.IconLocation = "%~dp0Convert.ico" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%
cscript /nologo %SCRIPT%
del %SCRIPT%

echo Compilando e executando o programa...
javac "%~dp0FileConverter.java"
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Falha ao compilar o programa.
    echo Verifique se o JDK esta instalado corretamente.
    pause
    exit /b 1
)

echo Iniciando o programa...
java -cp "%~dp0" PixelConverts.FileConverter
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Falha ao executar o programa.
    echo Verifique se o Java esta instalado corretamente.
)
pause