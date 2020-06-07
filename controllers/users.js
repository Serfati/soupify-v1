const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require('bcrypt');
const ROLES = require("../models/roles");
const roleChecker = require("../middlewares/role-checker");
const paginator = require("../middlewares/paginator");
const HttpStatus = require("http-status-codes");
const AlreadyExistException = require("../models/Exceptions/AlreadyExistException.js");
const ErrorMessageModel = require("../models/ErrorMessageModel");
const NotFoundException = require("../models/Exceptions/NotFoundException");
const UserUpdatableInfoModel = require("../models/UserUpdatableInfoModel");

const soupifyRepository = require("../services/SoupifyRepository");

router.post("/", addUser)
router.get('/:id', passport.authenticate("jwt", {session: false}), getUserById)
router.get('/', passport.authenticate("jwt", {session: false}), roleChecker(ROLES.Admin), getAllUsers)
router.put("/:id", passport.authenticate("jwt", {session: false}), updateUser)
router.delete("/:id", passport.authenticate("jwt", {session: false}), roleChecker(ROLES.Admin), deleteUser);

async function getUserById(req, res) {
    try {
        const id = req.params.id;
        const user = await soupifyRepository.Users.getById(id);
        await res.json(user);
    } catch (e) {
        if (e instanceof NotFoundException) {
            await res
                .status(HttpStatus.NOT_FOUND)
                .json(new ErrorMessageModel(`User ${req.params.id} not found.`));
        } else {
            await res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new ErrorMessageModel("Internal Server Error. Error: " + e.message)
                );
        }
    }
}

async function getAllUsers(req, res) {
    try {
        let limit = (req.query.limit) ? parseInt(req.query.limit) : 5
        const users = await soupifyRepository.Users.getAll();
        const paginatedItems = await paginator(users, parseInt(req.query.page), limit)
        await res.json(paginatedItems);
    } catch (e) {
        await res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorMessageModel("Internal Server Error. Error: " + e.message)
            );
    }
}

async function updateUser(req, res) {
    try {
        const id = parseInt(req.params.id);
        const jsonBody = req.body;
        const sender = req.user;
        const currentUser = await soupifyRepository.Users.getById(id);

        const userData = new UserUpdatableInfoModel(
            currentUser,
            jsonBody.login,
            jsonBody.role,
            await bcrypt.hash(jsonBody.password, 10),
            jsonBody.avatar,
            jsonBody.fullname,
            jsonBody.is_blocked,
            jsonBody.email,
            jsonBody.country,
            jsonBody.question,
            jsonBody.answer
        );

        try {
            const userByLogin = await soupifyRepository.Users.getUserWithPasswordByLogin(userData.login);
            userData.password = userData.password ? userData.password : userByLogin.password;
            if (userByLogin.id !== id) {
                await res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(
                        new ErrorMessageModel(
                            `User with login ${userData.login} already exist.`
                        )
                    );
                return;
            }
        } catch (e) {
            if (e instanceof NotFoundException) {
            } else {
                await res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json(
                        new ErrorMessageModel("Internal Server Error. Error: " + e.message)
                    );
                return;
            }
        }

        if (id !== currentUser.id && sender.role !== ROLES.Admin) {
            await res
                .status(HttpStatus.FORBIDDEN)
                .json(new ErrorMessageModel("You can't update another user."));
            return;
        }

        if (userData.role !== currentUser.role && sender.role !== ROLES.Admin) {
            await res
                .status(HttpStatus.FORBIDDEN)
                .json(new ErrorMessageModel("Only manager can update the user role."));
            return;
        }

        if (
            userData.is_blocked !== currentUser.is_blocked &&
            sender.role !== ROLES.Admin
        ) {
            await res
                .status(HttpStatus.FORBIDDEN)
                .json(new ErrorMessageModel("Only manager can block the user."));
            return;
        }

        const user = await soupifyRepository.Users.update(id, userData);
        await res.json(user);
    } catch (e) {
        if (e instanceof NotFoundException) {
            await res
                .status(HttpStatus.NOT_FOUND)
                .json(new ErrorMessageModel(`User ${req.params.id} not found.`));
        } else {
            await res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new ErrorMessageModel("Internal Server Error. Error: " + e.message)
                );
        }
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        await soupifyRepository.Users.delete(id);
        await soupifyRepository.Metadata.delete(id);
        res.status(HttpStatus.OK).send();
    } catch (e) {
        if (e instanceof NotFoundException) {
            await res
                .status(HttpStatus.NOT_FOUND)
                .json(new ErrorMessageModel(`User ${req.params.id} not found.`));
        } else {
            await res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new ErrorMessageModel("Internal Server Error. Error: " + e.message)
                );
        }
    }
}

async function addUser(req, res) {
    try {
        const jsonBody = req.body;
        const password = jsonBody.password;
        const login = jsonBody.login;
        if (!(login && password)) {
            await res
                .status(HttpStatus.BAD_REQUEST)
                .json(new ErrorMessageModel("No login or password"));
            return;
        }
        const hash = await bcrypt.hash(password, 10);
        const newUser = await soupifyRepository.Users.add(login, hash);
        await soupifyRepository.Metadata.add(newUser.id);
        await res.status(HttpStatus.CREATED).json(newUser);
    } catch (e) {
        if (e instanceof AlreadyExistException) {
            await res
                .status(HttpStatus.CONFLICT)
                .json(new ErrorMessageModel(`User already exist.`));
        } else {
            await res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new ErrorMessageModel("Internal Server Error. Error: " + e.message)
                );
        }
    }
}

module.exports = router;
