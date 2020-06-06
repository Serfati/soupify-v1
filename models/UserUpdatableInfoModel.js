class UserUpdatableInfoModel {
    constructor(
        currentUser,
        login,
        role,
        password,
        avatar,
        fullname,
        is_blocked,
        email,
        country,
        question,
        answer
    ) {
        this.login = login && login !== "" ? login : currentUser.login;
        this.role = role ? role : currentUser.role;
        this.password = password ? password : null;
        this.avatar = avatar ? avatar : currentUser.avatar;
        this.fullname = fullname ? fullname : currentUser.fullname;
        this.is_blocked = is_blocked ? is_blocked : currentUser.is_blocked;
        this.email = email ? email : currentUser.email;
        this.country = country ? country : currentUser.country;
        this.question = question ? question : currentUser.question;
        this.answer = answer ? answer : currentUser.answer;
    }
}

module.exports = UserUpdatableInfoModel;
