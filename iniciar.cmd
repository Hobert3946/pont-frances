@echo off
rem Abre o Pont no navegador (Edge tem as melhores vozes francesas no Windows).
cd /d "%~dp0"
start "" msedge http://localhost:5173 || start "" http://localhost:5173
node serve.mjs 5173
