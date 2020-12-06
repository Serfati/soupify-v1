<img src="https://in.bgu.ac.il/marketing/graphics/BGU.sig3-he-en-white.png" height="48px" align="right" />
<img src=https://nerdychefs.com/wp-content/uploads/2020/04/cropped-chefs_logo_FAVICON.png height="120"/>  

![](https://img.shields.io/badge/version-1.1-blueviolet)
![](https://img.shields.io/npm/v/npm)

# Description
:elephant: PostgreSQL Backend server for **Soupify** recipes webapp. Written with Node.js + express using Azure cloud :cyclone:
This project is created for learning purposes of code quality, testing and architecture design.
This RESTful API deployed with the help of [`Heroku`](https://heroku.com/) which allowing CD.
<br>**Live** API Server: **[`https://soupify.herokuapp.com/api`](https://soupify.herokuapp.com/api)**.

---

## Linked Repositories

- [Front-end Web client](https://github.com/uspeit/webenv-assignment3-client)
- [API Specification v1.2](https://github.com/Serfati/soupify-api-specs)
---

## 📃 Documentation

- [OpenApi 3 Specification](https://app.swaggerhub.com/apis-docs/serfatio/Soupify/1.2) - files in [API](https://github.com/Serfati/soupify-v1/tree/master/API/OpenAPI) folder
- [Vue.js Web Application](https://uspeit.github.io/webenv-assignment3-client-dist/#/)
- Default Users: 
  - Admin - root: toor!1
---

## ⚠️ Prerequisites

You need to have installed the following software:

- [Node.js](https://nodejs.org/en/) (>=10.0.0)
- [npm](https://npmjs.com/) (>= 6.13.0)

## 📦 How To Install

You can modify or contribute to this project by following the steps below:

**1. Clone the repository**

- Open terminal ( <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd> )

- [Clone](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) to a location on your machine.

  ```shell
  # Clone the repository
  $> git clone https://github.com/serfati/soupify.git

  # Navigate to the directory
  $> cd soupify
  ```

**2. Setup**

- Install npm packages in project directory

  ```bash
  $> npm install
  ```

- Create a copy of [`.env.example`](https://github.com/Serfati/soupify/blob/master/.env.example) file to `.env` <br>
   ```bash
   $> cp .env.example .env
   ```
- Set up your environment in the new `/.env` file

    You can change the selected environment 

    ```cfg
    app_name=soupify
    node_port=5000
    database_name=
    database_host=
    database_user=
    database_port=
    database_password=
    secretOrKeyJwt=
    files_path=
    spooncaular=
    cloudinary_name=
    cloudinary_key=
    cloudinary_secret=
    bcrypt_rounds=10
    ```

**3. Run Locally**

```bash
# run server
$> npm start

# open your browser at port 5000
$> google-chrome http://localhost:5000/

```

- Or just click here: [http://localhost:5000/](http://localhost:5000/)

## Dependencies and Main Packages

- `express.js` - web application framework
- `passport` - JWT authorization
- `axios` - HTTP requests
- `PostgreSQL` - Azure server
- other dependencies you can see in [`package.json`](https://github.com/serfati/soupify/blob/master/package.json)

## 📜 Scripts:

- `start` - Run whole application
- `dev` - Run application in development mode
- `test` - Run all tests

---

## ⚖️ License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2020 © <a href="https://github.com/serfati" target="_blank">serfati</a>.

**[⬆ back to top](#description)**
