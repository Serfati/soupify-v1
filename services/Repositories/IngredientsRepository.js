const BaseRepository = require('./BaseRepository')
const InvalidArgumentException = require('../../models/Exceptions/InvalidArgumentException')
const NotFoundException = require('../../models/Exceptions/NotFoundException')
const format = require('pg-format');


class IngredientsRepository extends BaseRepository {

    async getAll() {
        const result = await this._client.query(`SELECT * FROM ${this._table};`)

        const ingredients = []
        result.rows.forEach(ingredientRow => {
            ingredients.push(this._getIngredientFromRow(ingredientRow))
        })

        return ingredients
    }

    async add(ingredient) {
        const query = format(`INSERT INTO ${this._table} (name) VALUES ('${ingredient.name}') RETURNING  *`);

        const result = await this._client.query(query)
        return this._getIngredientFromRow(result.rows[0])
    }

    async delete(id) {
        if (!(await this.getById(id))) {
            throw new NotFoundException()
        }
        const query = format(`DELETE FROM ${this._table} WHERE id = ${id}`);
        await this._client.query(query)
    }

    async update(id, ingredient) {
        const ingredientCurrent = await this.getById(id)

        if (ingredient.name === undefined) {
            ingredient.name = ingredientCurrent.name
        }

        const query = format(`UPDATE ${this._table} SET (name) 
            = ('{${ingredient.name}}') WHERE id = ${id}`,);

        await this._client.query(query)

        return await this.getById(id)
    }

    async getById(id) {
        let result = await this._client.query(`SELECT * FROM ${this._table} WHERE id = '${id}';`)
        // noinspection JSUnresolvedVariable
        if (result.rowCount > 0) {
            return this._getIngredientFromRow(result.rows[0])
        } else {
            throw new NotFoundException()
        }
    }

    _getIngredientFromRow(row) {
        return {id: row.id, name: row.name}
    }
}

module.exports = IngredientsRepository