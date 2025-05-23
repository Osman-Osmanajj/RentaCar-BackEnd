## 🚗 SSH-Projekti – Backend

**Moduli:** Sistemet e Shpërndara 2024/2025
**Pjesa:** Backend REST API për menaxhimin e sistemit rent-a-car me multi-tenancy
**Teknologjitë:** Node.js, Express.js, PostgreSQL, Sequelize ORM, Swagger, JWT, Jest

---

## 📌 Përmbajtja

* [Përshkrimi](#përshkrimi)
* [Teknologjitë e përdorura](#teknologjitë-e-përdorura)
* [Struktura e projektit](#struktura-e-projektit)
* [Instalim & Setup](#instalim--setup)
* [Autentikim dhe Autorizim](#autentikim-dhe-autorizim)
* [Multi-Tenancy](#multi-tenancy)
* [Dokumentimi i API-së (Swagger)](#dokumentimi-i-api-së-swagger)
* [Testim](#testim)
* [Komanda të dobishme](#komanda-të-dobishme)
* [Licenca](#licenca)

---

## 📖 Përshkrimi

Ky backend ofron një RESTful API për menaxhimin e një platforme rent-a-car që funksionon në modelin multi-tenant. Çdo tenant ka një skemë të dedikuar në PostgreSQL, duke mundësuar izolim dhe menaxhim të dhënash të ndara për çdo lokacion të brendshëm të kompanisë.

---

## 🛠️ Teknologjitë e përdorura

* **Node.js** – runtime JS për zhvillimin e shpejtë të API-ve
* **Express.js** – framework për krijimin e REST endpoints
* **PostgreSQL** – sistem relacionar për ruajtjen e të dhënave
* **Sequelize** – ORM për PostgreSQL
* **Swagger UI** – dokumentim i automatizuar i API-ve
* **JWT** – për autentikim të sigurt
* **Jest + Supertest** – për unit dhe integration tests
* **dotenv** – për menaxhim të variablave të ambientit

---

## 🚀 Instalim & Setup

```bash
# 1. Klono projektin
git clone https://github.com/emri/ssh-projekti.git
cd ssh-projekti/backend

# 2. Instalo varësitë
npm install express sequelize pg pg-hstore dotenv jsonwebtoken bcryptjs cors
npm install swagger-ui-express swagger-jsdoc
npm install express-validator
npm install cookie-parser


# 3. Konfiguro .env
cp .env.example .env
# Plotëso: DB_USERNAME, DB_PASSWORD, JWT_SECRET, ...

# 4. Bëj migrimet fillestare
npx sequelize-cli db:migrate

# 5. Starto serverin
npx nodemon index
```

---

## 🔐 Autentikim dhe Autorizim

* Login dhe regjistrim me **JWT**
* Middleware për verifikim të aksesit:

  * `authenticateUser`: kontrollon token-in
  * `authorizeRole`: lejon vetëm role specifike (admin, employee)
  * `resolveTenant`: ngarkon modelet për tenant-in aktiv

---

## 🏢 Multi-Tenancy

* Përdor PostgreSQL **schemas** për izolim të dhënash
* Çdo tenant ka tabelat e veta si `cars`, `bookings`, `users`
* Skema krijohet automatikisht në regjistrim të tenant-it të ri
* Modelet ngarkohen dinamikisht në bazë të `tenant_id` në token

---

## 📘 Dokumentimi i API-së (Swagger)

Swagger UI është i qasshëm në:

```
http://localhost:3000/api-docs
```

## 🧪 Testim

Testimi bëhet me Jest dhe Supertest për API endpoints.

```bash
# Run tests
npm run test
```

---

## 💻 Komanda të dobishme

| Komanda                        | Përshkrim                   |
| ------------------------------ | --------------------------- |
| `npm run dev`                  | Starton serverin me nodemon |
| `npm run start`                | Starton serverin pa nodemon |
| `npx sequelize-cli db:migrate` | Ekzekuton migrimet          |
| `npm run test`                 | Ekzekuton testet            |
| `npx sequelize-cli seed:all`   | Fut të dhëna fillestare     |

---

## 📄 Licenca

Ky projekt është zhvilluar ekskluzivisht për nevoja edukative në kuadër të lëndës “Sistemet e Shpërndara” në Universitetin e Prishtinës. Çdo përdorim tjetër kërkon miratim nga autori.
