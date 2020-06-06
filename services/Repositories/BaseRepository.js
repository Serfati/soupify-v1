class BaseRepository {
    constructor(dbClient, tableName) {
        this._client = dbClient
        this._table = tableName
    }
}

module.exports = BaseRepository
