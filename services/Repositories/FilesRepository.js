const BaseRepository = require('./BaseRepository')
const FileModel = require('../../models/FileModel')
const NotFoundException = require('../../models/Exceptions/NotFoundException')

class FilesRepository extends BaseRepository {
    async getFile(fileId) {
        const result = await this._client.query(`SELECT * FROM ${this._table} WHERE id = \'${fileId}\';`)
        // noinspection JSUnresolvedVariable
        if (result.rowCount === 0) {
            throw new NotFoundException()
        }

        let fileInfo = result.rows[0]
        return new FileModel(fileInfo.id, fileInfo.name, fileInfo.type, fileInfo.path)
    }

    async saveFile(file) {
        const sqlQuery = `INSERT INTO ${this._table} (name, type, path) VALUES ('${file.name}', '${file.type}', '${file.path}')`
        await this._client.query(sqlQuery)
        return await this.getFileByPath(file.path)
    }

    async getFileByPath(path) {
        const res = await this._client.query(`SELECT * FROM ${this._table} WHERE path = \'${path}\';`)
        let fileInfo = res.rows[0]
        return new FileModel(fileInfo.id, fileInfo.name, fileInfo.type, fileInfo.path)
    }
}

module.exports = FilesRepository