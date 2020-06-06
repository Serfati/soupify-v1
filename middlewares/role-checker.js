const HttpStatus = require("http-status-codes")
const ROLES = require('../models/roles')

// Middleware function for check user role in router.
const checkIsInRole = (...roles) => (req, res, next) => {
    let user = req.user

    if (user.role !== ROLES.Admin && !roles.includes(user.role)) {
        return res.status(HttpStatus.FORBIDDEN).json({message: "No permission"})
    }

    return next()
}

module.exports = checkIsInRole
