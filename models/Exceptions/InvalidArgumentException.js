function InvalidArgumentException() {
    this.message = "Properties not set or invalid."
    this.toString = function () {
        return this.message
    }
}

module.exports = InvalidArgumentException
