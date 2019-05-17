import bcrypt from 'bcrypt'
import { User } from '../models'

export default async (req, res, next) => {
    // verifyAuth middleware passes on req.userData
    const user = await User.findOne({ _id: req.userData.userId })
    // check correct password has been provided to confirm the action
    if (!req.body.password) {
        return res.status(401).json({
            type: "ERROR",
            message: "Auth Error: could not continue process"
        })
    }
    const password = await bcrypt.compare(req.body.password, user.password)
    // if password doesn't match then return auth error
    if (!password) {
        return res.status(401).json({
            type: "ERROR",
            message: "Auth Error: could not continue process"
        })
    }
    
    // if !!password then proceed with req
    next()
}