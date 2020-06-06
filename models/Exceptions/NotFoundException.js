function NotFoundException(customMessage) {
    this.message = customMessage ? customMessage : "Not found in system."
    this.toString = function () {
        return this.message
    }
}

module.exports = NotFoundException
