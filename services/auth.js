const jwt = require('jsonwebtoken')

// write middleware to check is JWT is in the header, get username from this JWT
const authentication = (req, res, next) => {
    // response 401 if no token
    const authHeader = req.cookies.token
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' })

            req.user = user
            next()
        })
    } else res.status(401).json({ message: 'Unauthorized' })
}

const authorization = (req, res, next) => {
    // return user if token is valid
    const authHeader = req.cookies.token
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' })

            req.user = user
        })
    }
    next()
}

module.exports = {
    authentication,
    authorization,
}
