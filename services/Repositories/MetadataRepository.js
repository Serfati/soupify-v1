const BaseRepository = require('./BaseRepository')
const AlreadyExistException = require("../../models/Exceptions/AlreadyExistException");
const NotFoundException = require("../../models/Exceptions/NotFoundException");
const format = require('pg-format');
const MetadataModel = require('../../models/MetadataModel')


class MetadataRepository extends BaseRepository {

    async removeFrom(user_id, col, recipe_id) {
        if (!(await this.getById(user_id))) throw new NotFoundException()
        let result = await this.getById(user_id)
        let oldList = result[col]
        if (oldList.length <= 0)
            return await this.getById(user_id)
        let filtered = oldList.filter(function (value) {
            // noinspection EqualityComparisonWithCoercionJS
            return value != recipe_id;
        });
        let query = ''
        if (filtered.length <= 0)
            query = format(`UPDATE ${this._table} SET ${col} = ARRAY[]::INTEGER[] WHERE (user_id = ${user_id})`);
        else
            query = format(`UPDATE ${this._table} SET ${col} = ARRAY[${filtered}] WHERE (user_id = ${user_id})`);
        await this._client.query(query)
        return await this.getById(user_id)
    }

    async reorder(user_id, meal_order) {
        if (!(await this.getById(user_id))) throw new NotFoundException()
        let query = format(`UPDATE ${this._table} SET meal = ARRAY[${meal_order}] WHERE (user_id = ${user_id})`);
        await this._client.query(query)
        return await this.getById(user_id)
    }

    async getById(id) {
        let result = await this._client.query(`SELECT * FROM ${this._table} WHERE user_id = '${id}';`)
        if (result.rowCount > 0) {
            return this._getMetaFromRow(result.rows[0])
        } else {
            throw new NotFoundException()
        }
    }

    async getAllLists() {
        const result = await this._client.query(`SELECT * FROM ${this._table};`)

        const metas = []
        result.rows.forEach(mealRow => {
            metas.push(this._getMetaFromRow(mealRow))
        })

        return metas
    }

    async add(id) {
        if (!id)
            throw new Error("Argument exception. No id.");

        await this.checkExistId(id);

        // Create User
        const sqlQuery = `INSERT INTO ${this._table} (user_id, watched, favs, personal, meal, family) VALUES ('${id}',
         ARRAY[]::INTEGER[],ARRAY[]::INTEGER[],ARRAY[]::INTEGER[],ARRAY[]::INTEGER[],ARRAY[]::INTEGER[]) RETURNING *`;

        const result = await this._client.query(sqlQuery);
        const row = result.rows[0];
        return this._getMetaFromRow(row)
    }

    async checkExistId(id) {
        let newUserResult = await this._client.query(
            `SELECT COUNT(*) FROM ${this._table} WHERE user_id = '${id}'; `
        );
        let count = parseInt(newUserResult.rows[0].count);

        if (count !== 0) {
            throw new AlreadyExistException();
        }
    }

    async delete(id) {
        if (!(await this.getById(id))) {
            throw new NotFoundException();
        }
        const query = format(`DELETE FROM ${this._table} WHERE id = ${id}`);
        await this._client.query(query);
    }

    async addTo(user_id, col, recipe_id) {
        const query = format(`UPDATE ${this._table} SET ${col} = ${col} || ${recipe_id} WHERE user_id = ${user_id}`);
        await this._client.query(query)
        return await this.getById(user_id)
    }

    _getMetaFromRow(row) {
        return new MetadataModel(row.user_id, row.favs, row.watched, row.personal, row.meal, row.family)
    }
}

module.exports = MetadataRepository