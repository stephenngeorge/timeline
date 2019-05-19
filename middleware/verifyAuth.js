import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decodedToken = jwt.verify(token, process.env.JWT_KEY)
        req.userData = decodedToken
        next()
    }
    catch (e) {
        res.status(401).json({
            type: "ERROR",
            message: `Auth Error: invalid/missing authorization header`,
            e
        })
        next(e)
    }
}