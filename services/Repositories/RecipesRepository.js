const BaseRepository = require('./BaseRepository')
const InvalidArgumentException = require('../../models/Exceptions/InvalidArgumentException')
const NotFoundException = require('../../models/Exceptions/NotFoundException')
const format = require('pg-format');
const RecipeModel = require('../../models/RecipeModel')


class RecipesRepository extends BaseRepository {

    async getAll() {
        const result = await this._client.query(`SELECT * FROM ${this._table} ORDER BY id;`)

        const recipes = []
        result.rows.forEach(dishRow => {
            recipes.push(this._getRecipeFromRow(dishRow))
        })

        return recipes
    }

    async add(recipe) {
        const {extended_ingredients, ...dishWithoutArray} = recipe

        const query = format(`INSERT INTO ${this._table} (title, ready_in_minutes, aggregate_likes,serving, vegetarian,
                vegan, gluten_free, image, instructions, extended_ingredients) VALUES (%L, '{${format.string(extended_ingredients)}}') RETURNING  *`,
            Object.values(dishWithoutArray));

        const result = await this._client.query(query)
        return this._getRecipeFromRow(result.rows[0])
    }

    async update(id, recipe) {
        const recipeCurrent = await this.getById(id)

        if (recipe.title === undefined) {
            recipe.title = recipeCurrent.title
        }

        if (recipe.ready_in_minutes === undefined) {
            recipe.ready_in_minutes = recipeCurrent.ready_in_minutes
        }

        if (recipe.aggregate_likes === undefined) {
            recipe.aggregate_likes = recipeCurrent.aggregate_likes
        }

        if (recipe.serving === undefined) {
            recipe.serving = recipeCurrent.serving
        }

        if (recipe.vegetarian === undefined) {
            recipe.vegetarian = recipeCurrent.vegetarian
        }

        if (recipe.vegan === undefined) {
            recipe.vegan = recipeCurrent.vegan
        }

        if (recipe.gluten_free === undefined) {
            recipe.gluten_free = recipeCurrent.gluten_free
        }

        if (recipe.image === undefined) {
            recipe.image = recipeCurrent.image
        }

        if (recipe.instructions === undefined) {
            recipe.instructions = recipeCurrent.instructions
        }

        if (recipe.extended_ingredients === undefined) {
            recipe.extended_ingredients = recipeCurrent.extended_ingredients
        }

        const {extended_ingredients, ...dishWithoutArray} = recipe

        const query = format(`UPDATE ${this._table} SET (title, ready_in_minutes, aggregate_likes,serving, vegetarian,
                vegan, gluten_free, image, instructions, extended_ingredients) 
            = (%L, '{${format.string(extended_ingredients)}}') WHERE id = ${id}`,
            Object.values(dishWithoutArray));

        await this._client.query(query)

        return await this.getById(id)
    }

    async delete(id) {
        if (!(await this.getById(id))) {
            throw new NotFoundException()
        }
        const query = format(`DELETE FROM ${this._table} WHERE id = ${id}`);
        await this._client.query(query)
    }

    async getById(id) {
        let result = await this._client.query(`SELECT * FROM ${this._table} WHERE id = '${id}';`)
        if (result.rowCount > 0) {
            return this._getRecipeFromRow(result.rows[0])
        } else {
            throw new NotFoundException()
        }
    }

    _getRecipeFromRow(row) {
        return new RecipeModel(row.id, row.title, row.ready_in_minutes, row.aggregate_likes
            , row.serving, row.vegetarian, row.vegan, row.gluten_free, row.image, row.instructions
            , JSON.parse(row.extended_ingredients.replaceAt(0, '[').replaceAt(row.extended_ingredients.length - 1, ']'))
        )
    }
}

module.exports = RecipesRepository