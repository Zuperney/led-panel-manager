@echo off
echo ========================================
echo     Led Panel Manager - Iniciando...
echo ========================================
echo.

echo [1/4] Verificando dependencias do backend...
cd backend
if not exist node_modules (
    echo Instalando dependencias do backend...
    npm install
)

echo [2/4] Iniciando servidor backend...
start "Led Panel Backend" cmd /k "echo Backend iniciando... && npm start"

echo [3/4] Aguardando backend ficar disponivel...
timeout /t 8 /nobreak > nul

echo [4/4] Verificando dependencias do frontend...
cd ..
if not exist node_modules (
    echo Instalando dependencias do frontend...
    npm install
)

echo Iniciando frontend React + Vite...
echo.
echo ========================================
echo   Backend: http://localhost:3030
echo   Frontend: http://localhost:5173
echo ========================================
echo.

timeout /t 3 /nobreak > nul
start http://localhost:5173

npm run dev
