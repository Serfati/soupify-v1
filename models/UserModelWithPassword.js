const UserModel = require("./UserModel")

class UserModelWithPassword extends UserModel {
    constructor(id, login, password, role, avatar, fullname, is_blocked, email, country, question, answer) {
        super(id, login, role, avatar, fullname, is_blocked, email, country, question, answer)
        this.password = password
        this.question = question
        this.answer = answer
    }
}

module.exports = UserModelWithPassword
