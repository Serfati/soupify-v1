const express = require('express')
const router = express.Router()
const passport = require("passport")
const HttpStatus = require('http-status-codes')
const ROLES = require("../models/roles");
const roleChecker = require("../middlewares/role-checker");
const AlreadyExistException = require("../models/Exceptions/AlreadyExistException.js");
const ErrorMessageModel = require("../models/ErrorMessageModel");
const NotFoundException = require("../models/Exceptions/NotFoundException");

const soupifyRepository = require('../services/SoupifyRepository')

router.get("/info", passport.authenticate("jwt", {session: false}), roleChecker(ROLES.Admin), getAllLists)
router.get("/", passport.authenticate("jwt", {session: false}), getMetaById)

router.get("/meal", passport.authenticate("jwt", {session: false}), getMeal)
router.get("/favs", passport.authenticate("jwt", {session: false}), getFavs)
router.get("/watched", passport.authenticate("jwt", {session: false}), getWatched)
router.get("/personal", passport.authenticate("jwt", {session: false}), getPersonal)

router.post("/meal/:recipe", passport.authenticate("jwt", {session: false}), updateMeal)
router.post("/favs/:recipe", passport.authenticate("jwt", {session: false}), updateFavs)
router.post("/watched/:recipe", passport.authenticate("jwt", {session: false}), updateWatched)
router.post("/personal/:recipe", passport.authenticate("jwt", {session: false}), updatePersonal)

router.delete("/favs/:recipe", passport.authenticate("jwt", {session: false}), removeFromFavs)
router.delete("/meal/:recipe", passport.authenticate("jwt", {session: false}), removeFromMeal)
router.delete("/watched/:recipe", passport.authenticate("jwt", {session: false}), removeFromWatched)
router.delete("/personal/:recipe", passport.authenticate("jwt", {session: false}), removePersonal)

async function addMeta(req, res) {
    try {
        const id = req.user.id;
        if (!id) {
            await res
                .status(HttpStatus.BAD_REQUEST)
                .json(new ErrorMessageModel("No id"));
            return;
        }
        const newMeta = await soupifyRepository.Metadata.add(id);
        await res.status(HttpStatus.CREATED).json(newMeta);
    } catch (e) {
        if (e instanceof AlreadyExistException) {
            await res
                .status(HttpStatus.CONFLICT)
                .json(new ErrorMessageModel(`ID Metadata already exist.`));
        } else {
            await res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new ErrorMessageModel("Internal Server Error. Error: " + e.message)
                );
        }
    }
}

async function getAllLists(req, res) {
    try {
        const lists = await soupifyRepository.Metadata.getAllLists()
        await res.json(lists)
    } catch (e) {
        await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
    }
}

async function getMetaById(req, res) {
    try {
        const id = req.user.id
        const meta = await soupifyRepository.Metadata.getById(id)
        await res.json(meta)
    } catch (e) {
        if (e instanceof NotFoundException) {
            console.log("id not found, creating metadata.")
            await addMeta(req, res)
        } else
            await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
    }
}

async function getMeal(req, res) {
    try {
        const id = req.user.id
        const meta = await soupifyRepository.Metadata.getById(id)
        await res.json({meal: meta.meal})
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(e.message)
        else
            await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
    }
}

async function getFavs(req, res) {
    try {
        const id = req.user.id
        const meta = await soupifyRepository.Metadata.getById(id)
        await res.json({favs: meta.favs})
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(e.message)
        else
            await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
    }
}

async function getPersonal(req, res) {
    try {
        const id = req.user.id
        const meta = await soupifyRepository.Metadata.getById(id)
        await res.json({personal: meta.personal})
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(e.message)
        else
            await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
    }
}

async function getWatched(req, res) {
    try {
        const id = req.user.id
        const meta = await soupifyRepository.Metadata.getById(id)
        await res.json({watched: meta.watched})
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(e.message)
        else
            await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
    }
}

async function updateMeal(req, res) {
    try {
        const user_id = req.user.id
        const recipe_id = req.params.recipe
        const updatedMeta = await soupifyRepository.Metadata.addTo(user_id, "meal", recipe_id)
        await res.json(updatedMeta)
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel(e.message))
        else
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message))
    }
}

async function updateFavs(req, res) {
    try {
        const user_id = req.user.id
        const recipe_id = req.params.recipe
        const updatedMeta = await soupifyRepository.Metadata.addTo(user_id, "favs", recipe_id)
        await res.json(updatedMeta)
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel(e.message))
        else
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message))
    }
}

async function updateWatched(req, res) {
    try {
        const user_id = req.user.id
        const recipe_id = req.params.recipe
        const updatedMeta = await soupifyRepository.Metadata.addTo(user_id, "watched", recipe_id)
        await res.json(updatedMeta)
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel(e.message))
        else
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message))
    }
}

async function updatePersonal(req, res) {
    try {
        const user_id = req.user.id
        const recipe_id = req.params.recipe
        const updatedMeta = await soupifyRepository.Metadata.addTo(user_id, "personal", recipe_id)
        await res.json(updatedMeta)
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel(e.message))
        else
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message))
    }
}

async function removeFromFavs(req, res) {
    try {
        const user_id = req.user.id
        const recipe_id = req.params.recipe
        const updatedMeta = await soupifyRepository.Metadata.removeFrom(user_id, "favs", recipe_id)
        await res.json(updatedMeta)
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel(e.message))
        else
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message))
    }
}

async function removeFromMeal(req, res) {
    try {
        const user_id = req.user.id
        const recipe_id = req.params.recipe
        const updatedMeta = await soupifyRepository.Metadata.removeFrom(user_id, "meal", recipe_id)
        await res.json(updatedMeta)
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel(e.message))
        else
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message))
    }
}

async function removeFromWatched(req, res) {
    try {
        const user_id = req.user.id
        const recipe_id = req.params.recipe
        const updatedMeta = await soupifyRepository.Metadata.removeFrom(user_id, "watched", recipe_id)
        await res.json(updatedMeta)
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel(e.message))
        else
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message))
    }
}

async function removePersonal(req, res) {
    try {
        const user_id = req.user.id
        const recipe_id = req.params.recipe
        const updatedMeta = await soupifyRepository.Metadata.removeFrom(user_id, "personal", recipe_id)
        await res.json(updatedMeta)
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel(e.message))
        else
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message))
    }
}

module.exports = router;