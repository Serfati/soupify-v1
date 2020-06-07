# 🥘 Soupify - Back-end <img src="https://in.bgu.ac.il/marketing/graphics/BGU.sig3-he-en-white.png" height="48px" align="right" />

![](https://github.com/Miczeq22/the-recipe-book-server/workflows/Node%20CI/badge.svg)
![](https://img.shields.io/badge/version-0.1.0-blueviolet)

# Description

This is the backend server for the **Soupify** recipes frontend.
This project is created for learning purposes of code quality, testing and architecture design.
This RESTful API deployed with the help of [`Heroku`](https://heroku.com/) which allowing CD.
<br>Base API: **[`https://soupify.herokuapp.com/api`](https://soupify.herokuapp.com/api)**.

---

## Linked Repositories

- [Front-end Web client](https://github.com/uspeit/webenv-assignment3-client)
- [API Specification](https://github.com/Serfati/soupify-api-specs)

---

## 📃 Documentation

- [OpenApi 3 Specification](https://app.swaggerhub.com/apis-docs/serfatio/Soupify/1.0.0#/)
- [Web application](https://uspeit.github.io/webenv-assignment3-client-dist)

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

## Team Members:

| Name             | Username                                    | Contact Info              | ID        |
| ---------------- | ------------------------------------------- | ------------------------- | --------- |
| _Yarden Levy_    | [YardenLevy](https://github.com/YardenLevy) | YardenLevy@post.bgu.ac.il | 204341580 |
| _Avihai Serfati_ | [serfati](https://github.com/serfati)       | serfata@post.bgu.ac.il    | 204520803 |
| _Eitan Fedenko_  | [uspeit](https://github.com/uspeit)         | eitanfe@post.bgu.ac.il    | 319199840 |

---

## ⚖️ License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2020 © <a href="https://github.com/serfati" target="_blank">serfati</a>.

**[⬆ back to top](#description)**