const express = require("express");
const router = express.Router();
const passport = require("passport");
const HttpStatus = require("http-status-codes");
const IngredientModel = require("../models/IngredientModel");
const ErrorMessageModel = require("../models/ErrorMessageModel");
const InvalidArgumentException = require('../models/Exceptions/InvalidArgumentException');
require("../models/Exceptions/AlreadyExistException");
const NotFoundException = require("../models/Exceptions/NotFoundException");

const soupifyRepository = require("../services/SoupifyRepository");

router.get("/", getAllIngredients);
router.post("/", passport.authenticate("jwt", {session: false}), createIngredient);
router.get("/:id", passport.authenticate("jwt", {session: false}), getIngredientById);
router.put("/:id", passport.authenticate("jwt", {session: false}), updateIngredient);
router.delete("/:id", passport.authenticate("jwt", {session: false}), removeIngredient);

async function getAllIngredients(req, res) {
    try {
        const ingredient = await soupifyRepository.Ingredients.getAll();
        await res.json(ingredient);
    } catch (e) {
        await res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorMessageModel("Internal Server Error. Error: " + e.message)
            );
    }
}

async function getIngredientById(req, res) {
    try {
        const id = req.params.id;
        const ingredient = await soupifyRepository.Ingredients.getById(id);
        await res.json(ingredient);
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(e.message);
        else
            await res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new ErrorMessageModel("Internal Server Error. Error: " + e.message)
                );
    }
}

async function createIngredient(req, res) {
    try {
        const newIngredient = req.body;
        if (!newIngredient.name) throw new InvalidArgumentException();
        const ingredientCreateInfo = new IngredientModel(newIngredient.name);
        const ingredientFullInfo = await soupifyRepository.Ingredients.add(ingredientCreateInfo);
        await res.status(HttpStatus.CREATED).json(ingredientFullInfo);
    } catch (e) {
        if (e instanceof InvalidArgumentException) {
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message))
        } else {
            await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(new ErrorMessageModel("Internal Server Error. Error: " + e.message))
        }
    }
}

async function removeIngredient(req, res) {
    try {
        const id = req.params.id;
        await soupifyRepository.Ingredients.delete(id);
        res.status(HttpStatus.OK).send();
    } catch (e) {
        if (e instanceof NotFoundException) {
            await res
                .status(HttpStatus.NOT_FOUND)
                .json(new ErrorMessageModel(`Recipe ${req.params.id} not found.`));
        } else {
            await res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new ErrorMessageModel("Internal Server Error. Error: " + e.message)
                );
        }
    }
}

async function updateIngredient(req, res) {
    try {
        const id = req.params.id;
        const ingredientJson = req.body;
        const ingredient = new IngredientModel(
            ingredientJson.name
        );

        const updatedIngredient = await soupifyRepository.Ingredients.update(
            id,
            ingredient
        );
        await res.json(updatedIngredient);
    } catch (e) {
        if (e instanceof NotFoundException)
            await res.status(HttpStatus.NOT_FOUND).json(new ErrorMessageModel(e.message));
        else
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message));
    }
}

module.exports = router;
