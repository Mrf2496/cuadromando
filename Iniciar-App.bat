@echo off
echo ==============================================
echo Iniciando Aplicacion Localmente...
echo ==============================================
echo.

echo 1. Generando Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [Error] Fallo al generar Prisma Client.
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Sincronizando base de datos local (SQLite)...
call npx prisma db push
if %errorlevel% neq 0 (
    echo [Error] Fallo al sincronizar base de datos.
    pause
    exit /b %errorlevel%
)

echo.
echo 3. Iniciando servidor Next.js...
echo Abre tu navegador en: http://localhost:3001
echo.
call npm run dev
pause
