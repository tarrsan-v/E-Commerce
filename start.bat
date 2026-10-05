@echo off
title Aura Luxe E-Commerce (UI/UX Project)
echo Starting Aura Luxe Web Server on http://localhost:5000 ...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
