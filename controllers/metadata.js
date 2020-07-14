require("lodash")
const axios = require("axios");
const express = require('express')
const router = express.Router()
const passport = require("passport")
const HttpStatus = require('http-status-codes')
const ROLES = require("../models/roles");
const roleChecker = require("../middlewares/role-checker");
const recipes = require("../controllers/recipes");
const AlreadyExistException = require("../models/Exceptions/AlreadyExistException.js");
const ErrorMessageModel = require("../models/ErrorMessageModel");
const NotFoundException = require("../models/Exceptions/NotFoundException");

const api_domain = "https://api.spoonacular.com/recipes";
const soupifyRepository = require('../services/SoupifyRepository')

router.get("/info", passport.authenticate("jwt", {session: false}), roleChecker(ROLES.Admin), getAllLists)
router.get("/", passport.authenticate("jwt", {session: false}), getMetaById)

router.get("/last-seen", passport.authenticate("jwt", {session: false}), lastSeen)
router.get("/:col", passport.authenticate("jwt", {session: false}), getColumn)
router.post("/:col/:recipe", passport.authenticate("jwt", {session: false}), updateList)
router.post("/reorder", passport.authenticate("jwt", {session: false}), reorderMeal)
router.delete("/:col/:recipe", passport.authenticate("jwt", {session: false}), removeFromList)


async function lastSeen(req, res) {
    try {
        const meta = await soupifyRepository.Metadata.getById(req.user.id)
        const lastList = meta["watched"].slice(-3).reverse()
        let lastSeen = await Promise.all(lastList.map(async function (item) {
            return fetchWatched(req.user.id, item)
        }));
        await res.status(HttpStatus.OK).json({results: lastSeen})
    } catch (e) {
        if (e instanceof NotFoundException) {
            await res.status(HttpStatus.NOT_FOUND).json(e.message)
        } else
            await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
    }
}

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

async function getColumn(req, res) {
    try {
        const column = req.params.col
        if (!validList(column)) throw new NotFoundException("invalid list name.")
        const id = req.user.id
        const meta = await soupifyRepository.Metadata.getById(id)
        await res.json({[column]: meta[column]})
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(e.message)
        else
            await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
    }
}

async function updateList(req, res) {
    try {
        const column = req.params.col
        if (!validList(column)) throw new NotFoundException("invalid list name.")
        const user_id = req.user.id
        const recipe_id = req.params.recipe
        await soupifyRepository.Metadata.removeFrom(user_id, column, recipe_id)
        const updatedMeta = await soupifyRepository.Metadata.addTo(user_id, column, recipe_id)
        await res.json(updatedMeta)
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel(e.message))
        else
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message))
    }
}

async function reorderMeal(req, res) {
    try {
        const user_id = req.user.id
        const meal_order = req.body
        const updatedMeta = await soupifyRepository.Metadata.reorder(user_id, meal_order)
        await res.json(updatedMeta)
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel(e.message))
        else
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message))
    }
}

async function removeFromList(req, res) {
    try {
        const column = req.params.col
        if (!validList(column)) throw new NotFoundException("invalid list name.")
        const user_id = req.user.id
        const recipe_id = req.params.recipe
        const updatedMeta = await soupifyRepository.Metadata.removeFrom(user_id, column, recipe_id)
        await res.json(updatedMeta)
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel(e.message))
        else
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message))
    }
}

function validList(col) {
    const lists = ["favs", "meal", "watched", "personal", "family"]
    return lists.contains(col);
}

async function fetchWatched(id, recipe_id) {
    try {
        let recipe
        if (recipe_id < 200)
            recipe = await soupifyRepository.Recipes.getById(recipe_id)
        else {
            recipe = await axios.get(`${api_domain}/${recipe_id}/information`, {
                params: {
                    includeNutrition: false,
                    apiKey: process.env.spooncaular
                }
            });
            recipe = recipe.data
            recipe = recipes.cleanUp([recipe]);
            recipe = recipe[0]
        }
        const meta = await soupifyRepository.Metadata.getById(id)
        const favs = meta["favs"].contains(parseInt(recipe_id))
        const watched = meta["watched"].contains(parseInt(recipe_id))
        recipe["favs"] = favs
        recipe["watched"] = watched
        return JSON.parse(JSON.stringify(recipe))
    } catch (e) {
        if (e instanceof NotFoundException) {
            console.log("recipe id or user not found.")
        } else
            console.log(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
    }
}

Array.prototype.contains = function (needle) {
    for (let i in this) {
        if (this[i] === needle) return true;
    }
    return false;
}

module.exports = router;
