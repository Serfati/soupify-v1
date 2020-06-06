class UserModel {
    constructor(id, login, role, avatar, fullname, is_blocked, email, country) {
        this.id = id
        this.login = login
        this.role = role
        this.avatar = avatar
        this.fullname = fullname
        this.is_blocked = is_blocked
        this.email = email
        this.country = country
    }
}

module.exports = UserModel
