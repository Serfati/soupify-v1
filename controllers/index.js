const express = require("express");
const morgan = require("morgan");
const router = express.Router();
const path = require("path");

const baseApi = "/api";

router.use(morgan("dev"));
router.use(`${baseApi}/users`, require("./users"));
router.use(`${baseApi}/authenticate`, require("./authenticate"));
router.use(`${baseApi}/upload`, require("./files"));
router.use(`${baseApi}/account`, require("./account"));
router.use(`${baseApi}/recipes`, require("./recipes"));
router.use(`${baseApi}/ingredients`, require("./ingredients"));
router.use(`${baseApi}/metadata`, require("./metadata"));
router.get("/", (_, res) => {
    res.redirect("/api");
});

router.get(`${baseApi}`, (_, res) => {
    res.sendFile(path.join(__dirname, '..', "/API/OpenAPI/index.html"));
});

module.exports = router;