<h1 align="center">
    <img src="https://cdn-icons-png.flaticon.com/512/4686/4686706.png" width="200px" height="200px">
  
ahu-painter-company
</h1>
ahu-painter-company is a kanban-style paint inventory stock management web application for A Paint Company. It comes bundled with an user management admin panel.

# Demo
<h1 align="center">
<img src="https://i.imgur.com/PWZEW2i.png">
https://paintcompany-f9438.web.app
</h1>

### Test Accounts and Roles
| Login   | Password | Role    |      Privileges    |
| ------  | -------- | ------- | -------------------|
| Adam    | 123456   | Admin   | Admin Panel Access |
| Jane    | 123456   | Painter | Board Read & Edit  |
| Painter | 123456   | Painter | Board Read & Edit  |
| John    | 123456   | Reader  | Board Read         |
| Jake    | 123456   | Reader  | Board Read         |

⚠️ Users can be created or deleted through the admin panel
## Development
* The frontend was built using Vue.js, TailwindCSS, and bundled using Vite.
* The backend was built using Express.js and hosted using Firebase Cloud Functions as a REST web service.
* Clientside user authentication is handled by Firebase Authentication.

This repository is a monorepo hosting both applications which must be deployed separately.

## Frontend Setup
You must obtain your own firebase config and setup the project environment variables using your secrets
```sh
git clone https://github.com/kzzy/ahu-painter-company.git
cd ahu-painter-company
npm install
```

### Development Build
```sh
npm run dev
```
### Production Build

```sh
npm run build
```

## Backend Setup
* Ensure that you have NodeJS v18 installed and a valid Firebase account under Blaze Plan

Create and define your own Firebase Admin SDK Service Account Credentials `admin.json`
```sh
git clone https://github.com/kzzy/ahu-painter-company.git
cd ahu-painter-company/backend/functions/config
```

### Build and Development
This opens up the Firebase local emulator to test your functions
```sh
firebase login
npm run serve
```

# Production Deployment
```sh
npm run deploy
```
