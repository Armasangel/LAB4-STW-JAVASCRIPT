#  Disci-App

**Laboratorio #4 — Sistemas y Tecnologías Web**  
Universidad del Valle de Guatemala | Semestre 1, 2026  
Docente: Marlon Fuentes

## Descripción

Disci-App es una aplicación web de gamification orientada a reforzar hábitos y la disciplina personal. Inspirada en mecánicas de RPG, el usuario puede crear misiones (hábitos), completarlas para ganar XP y subir de rango.

**Tecnologías utilizadas:** HTML5, CSS3 y JavaScript puro (vanilla). Sin librerías ni frameworks.

##  Funcionalidades

-  Crear misiones con **nombre**, **descripción** y **dificultad** (Fácil / Normal / Difícil)
-  Cada dificultad otorga XP: Fácil → 10 XP, Normal → 25 XP, Difícil → 50 XP
-  **XP Global** acumulado de todas las misiones completadas
-  **Sistema de rangos** según XP total:
  -  **Novato** — 0 a 99 XP
  -  **Guerrero** — 100 a 299 XP
  -  **Archimago** — 300+ XP
-  `console.log` por cada misión creada para validar su estructura
-  Lista de misiones legible con estado **PENDING** / **SUCCESFUL**
-  Botón para registrar una misión como completadas

## Estructura del proyecto
disci-app/
├── src/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .gitignore
└── README.md

## Guía de instalación y uso

### Opción 1 — Abrir directamente en el navegador (WSL)
git clone https://github.com/TU_USUARIO/disci-app.git
cd disci-app
explorer.exe src/index.html

### Opción 2 — Servidor local con Python (recomendado para WSL)
cd disci-app/src
python3 -m http.server 8080

Luego abre: [http://localhost:8080](http://localhost:8080)

### Opción 3 — Nginx (punto extra)

sudo apt update && sudo apt install nginx -y
sudo cp -r src/* /var/www/html/
sudo service nginx start

Abre: [http://localhost](http://localhost)
