const { HttpError } = require("../hellpers");
const jwt = require('jsonwebtoken');

const {SECRET_KEY} = process.env;

const checkAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || ""
    if(!authHeader){
        throw HttpError(401, 'Not authorized')
    }
    const [bearer, token] = authHeader.split(" ", 2);
    if(bearer !== "Bearer"){
        throw HttpError(401, 'Not authorized')
    }
    await jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(err){
            throw HttpError(401, 'Not authorized')
        }

        req.userId = decoded
        next()
    })
    } catch (error) {
        next(error)
    }
}

module.exports = checkAuth