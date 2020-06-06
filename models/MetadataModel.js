class MetadataModel {
    constructor(user_id, favs, watched, personal, meal) {
        this.user_id = user_id
        this.watched = watched
        this.favs = favs
        this.personal = personal
        this.meal = meal
    }
}

module.exports = MetadataModel