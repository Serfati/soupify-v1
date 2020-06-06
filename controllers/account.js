const express = require('express')
const router = express.Router()
const HttpStatus = require('http-status-codes')
const ErrorMessageModel = require('../models/ErrorMessageModel')
const passport = require("passport")

router.get("/", passport.authenticate("jwt", {session: false}), getCurrentAccount)

async function getCurrentAccount(req, res) {
    try {
        await res.json(req.user)
    } catch (e) {
        await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal server error. Error: " + e.message))
    }
}

module.exports = router
