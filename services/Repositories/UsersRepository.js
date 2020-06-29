const BaseRepository = require("./BaseRepository");
const UserModel = require("../../models/UserModel");
const validator = require("email-validator");
const UserModelWithPassword = require("../../models/UserModelWithPassword");
const AlreadyExistException = require("../../models/Exceptions/AlreadyExistException");
const NotFoundException = require("../../models/Exceptions/NotFoundException");
const format = require("pg-format");

class UsersRepository extends BaseRepository {
    async getAll() {
        const arrayUsers = [];

        const res = await this._client.query(
            `SELECT id, login, role, avatar, fullname, is_blocked,  email, country FROM ${this._table} ORDER BY id;`
        );

        res.rows.forEach((UserItem) => {
            const User = new UserModel(
                UserItem.id,
                UserItem.login,
                UserItem.role,
                UserItem.avatar,
                UserItem.fullname,
                UserItem.is_blocked,
                UserItem.email,
                UserItem.country,
            );
            arrayUsers.push(User);
        });
        return arrayUsers;
    }

    async update(id, updateInfo) {
        if (!(await this.getById(id))) {
            throw new NotFoundException();
        }

        const sqlQuery = format(
            `UPDATE ${this._table} SET (login, role, password, avatar, fullname, is_blocked, email, country, question, answer)
         = (%L) WHERE id = ${id}`,
            Object.values(updateInfo)
        );

        await this._client.query(sqlQuery);
        return await this.getById(id);
    }

    async setNewPassword(id, password) {
        if (!(await this.getById(id))) {
            throw new NotFoundException();
        }

        const sqlQuery = format(
            `UPDATE ${this._table} SET password
         = ('${password}') WHERE id = ${id}`);

        await this._client.query(sqlQuery);
        return await this.getById(id);
    }

    async add(login, password) {
        if (!(login && password))
            throw new Error("Argumnet exception. No login or password.");

        await this.checkExistUser(login);

        // Create User
        const sqlQuery = `INSERT INTO ${this._table} (login, password) VALUES ('${login}',
         '${password}') RETURNING id, login, role, avatar, fullname, is_blocked,  email, country, question, answer`;

        const result = await this._client.query(sqlQuery);
        const row = result.rows[0];
        return new UserModel(
            row.id,
            row.login,
            row.role,
            row.avatar,
            row.fullname,
            row.is_blocked,
            row.email,
            row.country,
        );
    }

    async delete(id) {
        if (!(await this.getById(id))) {
            throw new NotFoundException();
        }
        const query = format(`DELETE FROM ${this._table} WHERE id = ${id}`);
        await this._client.query(query);
    }

    async getUserWithPasswordByLogin(login) {
        let getUserResult = await this._client.query(
            `SELECT * FROM ${this._table} WHERE login = '${login}';`
        );

        if (getUserResult.rowCount === 0) {
            throw new NotFoundException();
        }

        let User = getUserResult.rows[0];

        return new UserModelWithPassword(
            User.id,
            User.login,
            User.password,
            User.role,
            User.avatar,
            User.fullname,
            User.is_blocked,
            User.email,
            User.country,
            User.question,
            User.answer
        );
    }

    async getById(id) {
        let getUserResult = await this._client.query(
            `SELECT * FROM ${this._table} WHERE id = '${id}';`
        );
        if (getUserResult.rowCount === 0) {
            throw new NotFoundException();
        }

        let user = getUserResult.rows[0];
        return new UserModel(
            user.id,
            user.login,
            user.role,
            user.avatar,
            user.fullname,
            user.is_blocked,
            user.email,
            user.country
        );
    }

    async checkExistUser(login) {
        let newUserResult = await this._client.query(
            `SELECT COUNT(*) FROM ${this._table} WHERE login = '${login}'; `
        );
        let count = parseInt(newUserResult.rows[0].count);

        if (count !== 0) {
            throw new AlreadyExistException();
        }
    }

    async getByLogin(login) {
        const mailOrLogin = !validator.validate(login) ? 'login' : 'email'

        let getUserResult = await this._client.query(
            `SELECT * FROM ${this._table} WHERE ${mailOrLogin} = '${login}'; `
        );

        if (getUserResult.rowCount === 0) {
            throw new NotFoundException();
        }

        let user = getUserResult.rows[0];
        return new UserModelWithPassword(
            user.id,
            user.login,
            user.password,
            user.role,
            user.avatar,
            user.fullname,
            user.is_blocked,
            user.email,
            user.country,
            user.question,
            user.answer
        );
    }
}

module.exports = UsersRepository;
