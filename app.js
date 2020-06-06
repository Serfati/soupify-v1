const express = require("express");
const app = express();
const passport = require("passport");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const chalk = require("chalk");
const cors = require("cors");
// Init config and auth
require("./config/config");
require("./middlewares/auth");

app.use(cors());
// Passport init for authentication.
app.use(passport.initialize());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

// Create file upload
app.use(fileUpload());

// Create routes.
app.use(require("./controllers"));

// Connect to database
const soupifyRepository = require("./services/SoupifyRepository");

(async () => {
    await soupifyRepository.createDatabaseIfNotExist();
    soupifyRepository.connect();
})();

// Start server app
const PORT = process.env.PORT || process.env.node_port;
app.listen(PORT, function () {
    console.log(chalk.bgGreen("\n----------------------------------------"));
    // noinspection JSUnresolvedVariable
    console.log(
        chalk.bgGreen.bold(
            `${process.env.app_name} started, listening on port ${PORT}.`
        )
    );
    console.log(chalk.bgGreen("----------------------------------------\n"));
});
