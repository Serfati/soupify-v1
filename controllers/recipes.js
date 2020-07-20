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
const AlreadyExistException = require("../models/Exceptions/AlreadyExistException");

const api_domain = "https://api.spoonacular.com/recipes";

const soupifyRepository = require("../services/SoupifyRepository");

router.post("/", passport.authenticate("jwt", {session: false}), createRecipe)
router.get("/", getAllRecipes);
router.get("/search", search);
router.get("/rand", random);
router.get("/:id", getRecipeById);
router.put("/:id", passport.authenticate("jwt", {session: false}), updateRecipe);
router.delete("/:id", passport.authenticate("jwt", {session: false}), roleChecker(ROLES.Admin), deleteRecipeById);
router.post("/:id/ingredients/:ingredientId", passport.authenticate("jwt", {session: false}), addIngredientToRecipe);
router.put("/:id/ingredients/:ingredientId", passport.authenticate("jwt", {session: false}), updateIngredientInRecipe);
router.delete("/:id/ingredients/:ingredientId", passport.authenticate("jwt", {session: false}), roleChecker(ROLES.Admin), deleteIngredientFromRecipe);

async function addIngredientToRecipe(req, res) {
    try {
        let id = req.params.id;
        let ingredientId = req.params.ingredientId;
        let amount = req.query.amount;
        let unit = req.query.unit;
        const recipe = await soupifyRepository.Recipes.getById(id);
        let ingredient = await soupifyRepository.Ingredients.getById(ingredientId);
        let raw = recipe.extended_ingredients.replaceAt(0, '[').replaceAt(recipe.extended_ingredients.length - 1, ']')
        let ingredients = JSON.parse(raw)
        ingredient["amount"] = parseInt(amount)
        ingredient["unit"] = unit
        ingredients.push(ingredient)
        recipe.extended_ingredients = ingredients
        req.body = recipe;
        await updateRecipe(req, res)
    } catch (e) {
        await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorMessageModel("Internal Server Error. Error: " + e.message)
        );
    }
}

async function updateIngredientInRecipe(req, res) {
    try {
        let id = req.params.id;
        let ingredientId = req.params.ingredientId;
        let amount = req.query.amount;
        let unit = req.query.unit;
        const recipe = await soupifyRepository.Recipes.getById(id);
        let raw = recipe.extended_ingredients.replaceAt(0, '[').replaceAt(recipe.extended_ingredients.length - 1, ']')
        let ingredients = JSON.parse(raw)

        recipe.extended_ingredients = ingredients.map(function (e, i) {
            if (ingredients[i].id != ingredientId)
                return ingredients[i]
            else {
                ingredients[i]["amount"] = amount
                ingredients[i]["unit"] = unit
                return ingredients[i]
            }
        })
        req.body = recipe;
        await updateRecipe(req, res)
    } catch (e) {
        await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorMessageModel("Internal Server Error. Error: " + e.message)
        );
    }
}

async function deleteIngredientFromRecipe(req, res) {
    try {
        let id = req.params.id;
        let ingredientId = req.params.ingredientId;
        const recipe = await soupifyRepository.Recipes.getById(id);
        let raw = recipe.extended_ingredients.replaceAt(0, '[').replaceAt(recipe.extended_ingredients.length - 1, ']')
        let ingredients = JSON.parse(raw)

        recipe.extended_ingredients = ingredients.filter(function (e, i) {
            return ingredients[i].id != ingredientId
        })
        req.body = recipe;
        await updateRecipe(req, res)
    } catch (e) {
        await res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
            new ErrorMessageModel("Internal Server Error. Error: " + e.message)
        );
    }
}

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

async function spoonInfo(req, res) {
    try {
        let recipe = await getInfo(req.params.id);
        let recipes = []
        recipes.push(recipe.data)
        recipes = cleanUp(recipes)
        recipes = JSON.parse(JSON.stringify(recipes));
        return recipes[0];
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
        const local = (req.query.local === 'true');
        const id = req.params.id;
        let recipe
        if (local)
            recipe = await soupifyRepository.Recipes.getById(id);
        else
            recipe = await spoonInfo(req, res);
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
        // TODO fetch random recipes from Spooncaular API
        let randoms = []
        let number = 3
        while (randoms.length != 3) {
            if (randoms.length > 1)
                number = 1
            randoms = await axios.get(`${api_domain}/random`, {
                params: {
                    apiKey: process.env.spooncaular,
                    number: number
                }
            })

            randoms = await Promise.all(
                randoms.data.recipes.map((recipe_raw) => getInfo(recipe_raw.id)));
            randoms = randoms.map((recipe) => recipe.data).filter((recipe) => recipe.instructions.length > 0);
            randoms = cleanUp(randoms)
        }

        // TODO fetch random recipes from database
        // let randoms = await Promise.all(Array(3).fill().map(async function (_, i) {
        //     let random = Math.floor(Math.random() * (160 - 100 + 1) + 100)
        //     let recipe = await soupifyRepository.Recipes.getById(random);
        //     return recipe
        // }));


        await res.status(HttpStatus.OK).json({results: randoms});
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
        const {query, cuisine, diet, intolerances, number, offset, page, limit, sort} = req.query;
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
        const sortBy = ['none', 'aggregate_likes', 'ready_in_minutes']
        let recipes = await Promise.all(
            search_response.data.results.map((recipe_raw) => getInfo(recipe_raw.id)));
        recipes = recipes
            .map((recipe) => recipe.data)
            .filter((recipe) => recipe.instructions.length > 0 && recipe.id > 200)
        recipes = cleanUp(recipes)
        if (sort && sort != 'none' && sortBy.contains(sort)) recipes = sorting(recipes, sort)
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

function sorting(recipes ,type) {
    recipes.sort((a, b) => (b[type]) - (a[type]));
    return recipes
}

Array.prototype.contains = function (needle) {
    for (let i in this) {
        if (this[i] === needle) return true;
    }
    return false;
}

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

module.exports = router
module.exports.cleanUp = cleanUp
