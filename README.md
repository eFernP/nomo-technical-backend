# nomo-technical-backend

Per executar el projecte:

    PART BACKEND:

    - Tenir instal·lat MySQL i crear la base de dades "nomo_db"

    - Entrar a la carpeta del projecte a través de la terminal i fer "npm install"

    - Crear un arxiu .env i posar les següents constants:
        DB_HOST = (per exemple localhost)
        DB_USER = (usuari de la base de dades)
        DB_PASSWORD = (contrasenya de l'usuari)
        DB_NAME = nomo_db
        PORT = (per exemple 8000)

    - Executar a la terminal "node index.js"

    PART FRONTEND:

    - Entrar a la carpeta del projecte a través de la terminal i executar "npm install".

    - Executar "npm start" també a la terminal.

    - La url del backend és per defecte http://localhost:8000/api/. Si es fa servir una altra, canviar la constant API_BASE_URL de Constants.js
