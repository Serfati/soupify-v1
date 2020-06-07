const axios = require("axios");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const ROLES = require("../models/roles");
const roleChecker = require("../middlewares/role-checker");
const HttpStatus = require("http-status-codes");
const RecipeDataModel = require("../models/RecipeDataModel");
const paginator = require("../middlewares/paginator");
const ErrorMessageModel = require("../models/ErrorMessageModel");
const InvalidArgumentException = require("../models/Exceptions/InvalidArgumentException");
const NotFoundException = require("../models/Exceptions/NotFoundException");
require("../models/Exceptions/AlreadyExistException");
const api_domain = "https://api.spoonacular.com/recipes";

const soupifyRepository = require("../services/SoupifyRepository");

router.post("/", passport.authenticate("jwt", {session: false}), createRecipe)
router.get("/", getAllRecipes);
router.get("/search", search);
router.get("/preview", preview);
router.get("/rand", random);
router.get("/:id", passport.authenticate("jwt", {session: false}), getRecipeById);
router.put("/:id", passport.authenticate("jwt", {session: false}), updateRecipe);
router.delete("/:id", passport.authenticate("jwt", {session: false}), roleChecker(ROLES.Admin), deleteRecipeById);

async function getAllRecipes(req, res) {
    try {
        let limit = (req.query.limit) ? parseInt(req.query.limit) : 5
        const recipes = await soupifyRepository.Recipes.getAll();
        const paginatedItems = await paginator(recipes, parseInt(req.query.page), limit)
        await res.json(paginatedItems);
    } catch (e) {
        await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorMessageModel("Internal Server Error. Error: " + e.message)
        );
    }
}

async function preview(req, res) {
    try {
        let recipe = await getInfo(req.query.id);
        let recipes = []
        recipes.push(recipe.data)
        recipes = cleanUp(recipes)
        recipes[0].instructions = undefined;
        recipes[0].extended_ingredients = undefined;
        recipes[0].serving = undefined;
        recipes = JSON.parse(JSON.stringify(recipes));
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(...recipes);
    } catch (e) {
        await res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorMessageModel("Internal Server Error. Error: " + e.message)
            );
    }
}

async function getRecipeById(req, res) {
    try {
        const id = req.params.id;
        const recipe = await soupifyRepository.Recipes.getById(id);
        const last_seen = await soupifyRepository.Metadata.checkExistId(id);
        await res.status(HttpStatus.OK).json(recipe);
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

async function deleteRecipeById(req, res) {
    try {
        const id = req.params.id;
        await soupifyRepository.Recipes.delete(id);
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

async function createRecipe(req, res) {
    try {
        const newRecipe = req.body;
        if (!newRecipe.title) throw new InvalidArgumentException();

        const recipeCreateInfo = new RecipeDataModel(
            newRecipe.title,
            newRecipe.ready_in_minutes,
            newRecipe.aggregate_likes,
            newRecipe.serving,
            newRecipe.vegetarian,
            newRecipe.vegan,
            newRecipe.gluten_free,
            newRecipe.image,
            newRecipe.instructions,
            newRecipe.extended_ingredients
        );

        const recipeFullInfo = await soupifyRepository.Recipes.add(recipeCreateInfo);
        await soupifyRepository.Metadata.addTo(req.user.id, 'meal', recipeFullInfo.id);
        await res.status(HttpStatus.CREATED).json(recipeFullInfo);
    } catch (e) {
        if (e instanceof InvalidArgumentException) {
            await res.status(HttpStatus.BAD_REQUEST).json(new ErrorMessageModel(e.message));
        } else
            await res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new ErrorMessageModel("Internal Server Error. Error: " + e.message)
                );
    }
}

async function updateRecipe(req, res) {
    try {
        const id = req.params.id;
        const recipeJson = req.body;
        const recipe = new RecipeDataModel(
            recipeJson.title,
            recipeJson.ready_in_minutes,
            recipeJson.aggregate_likes,
            recipeJson.serving,
            recipeJson.vegetarian,
            recipeJson.vegan,
            recipeJson.gluten_free,
            recipeJson.image,
            recipeJson.instructions,
            recipeJson.extended_ingredients
        );
        const updatedRecipe = await soupifyRepository.Recipes.update(id, recipe);
        await res.json(updatedRecipe);
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

async function random(_, res) {
    try {
        let rands = await axios.get(`${api_domain}/random`, {
            params: {
                apiKey: process.env.spooncaular,
                number: 3
            }
        })
        rands = cleanUp(rands.data.recipes)
        console.log(rands)
        rands[0].id = undefined;
        rands[1].id = undefined;
        rands[2].id = undefined;
        rands = JSON.parse(JSON.stringify(rands));
        await res.status(HttpStatus.OK).json({results: rands});
    } catch (e) {
        await res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorMessageModel("API Server Error. Error: " + e.message)
            );
    }
}

async function getInfo(id) {
    return await axios.get(`${api_domain}/${id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncaular
        }
    });
}

async function search(req, res) {
    try {
        const {query, cuisine, diet, intolerances, number, offset, page, limit} = req.query;
        const search_response = await axios.get(`${api_domain}/search`, {
            params: {
                query: query,
                cuisine: cuisine,
                diet: diet,
                intolerances: intolerances,
                number: number,
                instructionsRequired: true,
                offset: offset,
                apiKey: process.env.spooncaular
            }
        });
        let recipes = await Promise.all(
            search_response.data.results.map((recipe_raw) => getInfo(recipe_raw.id)));
        recipes = recipes.map((recipe) => recipe.data);
        recipes = cleanUp(recipes)
        let ids = recipes.map((recipe) => recipe.id);
        let lim = (limit) ? parseInt(limit) : 5
        let paginatedRecipes = await paginator(recipes, parseInt(page), lim)
        res.send({results: paginatedRecipes, ids: ids});
    } catch (e) {
        await res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorMessageModel("API Server Error. Error: " + e.message)
            );
    }
}

function cleanUp(recipes) {
    return recipes.map((recipe) => {
            const {
                id,
                title,
                readyInMinutes,
                aggregateLikes,
                servings,
                vegetarian,
                vegan,
                glutenFree,
                image,
                instructions,
                extendedIngredients
            } = recipe;
            let cleanedIngredients = recipe.extendedIngredients.map((ingredient) => {
                    const {
                        id,
                        name,
                        amount,
                        unit
                    } = ingredient;
                    return {
                        id: id,
                        name: name,
                        amount: amount,
                        unit: unit
                    }
                }
            )
            return {
                id: id,
                title: title,
                ready_in_minutes: readyInMinutes,
                aggregate_likes: aggregateLikes,
                serving: servings,
                vegetarian: vegetarian,
                vegan: vegan,
                gluten_free: glutenFree,
                image: image,
                instructions: instructions,
                extended_ingredients: cleanedIngredients
            }
        }
    );
}

Array.prototype.contains = function (needle) {
    for (let i in this) {
        if (this[i] === needle) return true;
    }
    return false;
}


module.exports = router;
