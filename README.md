# API Project

Dit project is een eenvoudige API gebouwd met Node.js en Express, met een MySQL-database. Het biedt functionaliteiten voor het beheren van gebruikers en nieuwsberichten (CRUD-operaties).

Inhoud
- Overzicht
- Installatie
- Configuratie
- Gebruik
- API Endpoints
- Projectstructuur
- Technologieën
- Auteur

Overzicht

De API biedt endpoints voor het ophalen, toevoegen, bewerken en verwijderen van gebruikers en nieuwsberichten. Daarnaast bevat de API een eenvoudige webinterface (`tester.html`) waarmee de functionaliteiten getest kunnen worden.

Installatie

1. Clone de repository:
   git clone https://github.com/AdrienG0/api-project.git

//

Configuratie
1. Database: Maak een MySQL-database aan en gebruik de juiste gebruikersnaam, wachtwoord en databasenaam in het .env bestand.
2. Port: De standaardpoort is ingesteld op 3000, maar dit kan worden aangepast in het .env bestand.

//

Gebruik
1. npm start
2. http://localhost:3000
3. Gebruik de tester.html pagina om de API te testen.

//

API Endpoints
Gebruikersbeheer

1. GET /users
Haal alle gebruikers op.

2. POST /users
Voeg een nieuwe gebruiker toe.

3. PUT /users/:id
Bewerk een bestaande gebruiker.

4. DELETE /users/:id
Verwijder een gebruiker.

Nieuwsberichtenbeheer
1. GET /newsposts
Haal alle nieuwsberichten op.

2. POST /newsposts
Voeg een nieuw nieuwsbericht toe.

3. PUT /newsposts/:id
Bewerk een bestaand nieuwsbericht.

4. DELETE /newsposts/:id
Verwijder een nieuwsbericht.

//

Projectstructuur
api-project/
├── public/
│   ├── tester.html
│   ├── docs.html
├── server.js
├── package.json
├── .env
├── README.md

//

Technologieën
1. Node.js
2. Express.js
3. MySQL
4. HTML
5. CSS

//

Auteur
Adrien Goksel