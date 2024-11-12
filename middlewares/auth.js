const createError  = require("http-errors");

function isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        next(createError(401));
    }
    next();
}

module.exports = {
    isAuthenticated
}
