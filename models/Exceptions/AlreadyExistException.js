function AlreadyExistException() {
    this.message = "Object already exist"
    this.toString = function () {
        return this.message
    }
}

module.exports = AlreadyExistException
