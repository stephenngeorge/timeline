import bcrypt from 'bcrypt'
import { User } from '../models'

export default async (req, res, next) => {
    // verifyAuth middleware passes on req.userData
    const user = await User.findOne({ _id: req.userData.userId })
    // check correct password has been provided to confirm the action
    if (!req.body.password) {
        res.status(401).json({
            type: "ERROR",
            message: "Auth Error: could not continue process"
        })
        let error = new Error('auth error')
        next(error)
    }
    const password = await bcrypt.compare(req.body.password, user.password)
    // if password doesn't match then return auth error
    if (!password) {
        res.status(401).json({
            type: "ERROR",
            message: "Auth Error: could not continue process"
        })
        let error = new Error('auth error')
        next(error)
    }
    
    // if !!password then proceed with req
    next()
}