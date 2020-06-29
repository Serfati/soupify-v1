const bcrypt = require('bcrypt');
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const HttpStatus = require('http-status-codes')
const generatePassword = require("password-generator");
const ErrorMessageModel = require('../models/ErrorMessageModel')
const NotFoundException = require('../models/Exceptions/NotFoundException')

const soupifyRepository = require('../services/SoupifyRepository')

router.post("/", authenticate)
router.put("/password-reset", validation)
router.post("/password-reset", question)

async function question(req, res) {

    const login = req.body.login
    if (!login) {
        await res.status(HttpStatus.BAD_REQUEST).json({message: "No login or email"})
        return
    }
    try {
        const user = await soupifyRepository.Users.getByLogin(login);
        if (user.is_blocked)
            await res.status(HttpStatus.UNAUTHORIZED).json(new ErrorMessageModel("Authentication failed. User is blocked."))
        const question = user.question
        if (question) {
            await res.json({question: question})
        } else {
            await res.status(HttpStatus.UNAUTHORIZED).json(new ErrorMessageModel("Authentication failed."))
        }
    } catch (e) {
        if (e instanceof NotFoundException) {
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel("Authentication failed. User not found."))
        } else {
            await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
        }
    }
}

async function validation(req, res) {

    const login = req.body.login
    const answer = req.body.answer

    if (!(login || answer)) {
        await res.status(HttpStatus.BAD_REQUEST).json({message: "No login or answer"})
        return
    }
    try {
        const user = await soupifyRepository.Users.getByLogin(login)
        if (user.is_blocked)
            await res.status(HttpStatus.UNAUTHORIZED).json(new ErrorMessageModel("Authentication failed. User is blocked."))
        const match = user.answer === answer
        const user_id = user.id;
        if (match) {
            let password = generatePassword(7, false, /[\w\d?\-]/);
            const hash = await bcrypt.hash(password, 10);
            await soupifyRepository.Users.setNewPassword(user_id, hash)
            await res.json({new_password: password})
        } else {
            await res.status(HttpStatus.UNAUTHORIZED).json(new ErrorMessageModel("Authentication failed."))
        }
    } catch (e) {
        if (e instanceof NotFoundException) {
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel("Authentication failed. User not found."))
        } else {
            await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
        }
    }
}

async function authenticate(req, res) {

    const password = req.body.password
    const login = req.body.login

    if (!(login && password)) {
        await res.status(HttpStatus.BAD_REQUEST).json({message: "No login or password"})
        return
    }
    try {
        const user = await soupifyRepository.Users.getUserWithPasswordByLogin(login)
        if (user.is_blocked)
            await res.status(HttpStatus.UNAUTHORIZED).json(new ErrorMessageModel("Authentication failed. User is blocked."))
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            const payload = {id: user.id, role: user.role}
            const token = jwt.sign(payload, process.env.secretOrKeyJwt, {expiresIn: "2 days"})
            const {password, question, answer, ...userWithoutPassword} = user
            await res.json({...userWithoutPassword, token})
        } else {
            await res.status(HttpStatus.UNAUTHORIZED).json(new ErrorMessageModel("Authentication failed. Wrong password."))
        }
    } catch (e) {
        if (e instanceof NotFoundException) {
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel("Authentication failed. User not found."))
        } else {
            await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
        }
    }
}

module.exports = router
