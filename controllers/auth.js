import { Node, Timeline, User } from '../models'
import { validate } from '../utils'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// GET USER COUNT
export const userCount = async (req, res, next) => {
    try {
        const users = await User.find()
        return res.json({userCount: users.length})
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: "failed to fetch users",
            data: e
        })
    }
}
// GET SINGLE USER BY ID
export const getSingleUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).populate('timelines')
        return res.json({
            type: "READ",
            message: `found user: ${user.username}`,
            data: user
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to find user: ${req.params.id}`,
            data: e
        })
    }
}

// CREATE NEW USER
export const userSignUp = async (req, res, next) => {
    try {
        // check username availability
        const checkUsername = await User.find({ username: req.body.username })
        if (checkUsername.length !== 0) {
            const error = new Error('username not available')
            next(error)
        }
        // create user if username is available
        // validate & hash password
        const validPassword = validate(req.body.password)
        if (!validPassword) {
            const error = new Error('invalid password')
            next(error)
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // create new user
        const user = await new User({ ...req.body, password: hashedPassword }).save()
        return res.json({
            type: "CREATE",
            message: `created new user: ${user.username}`,
            data: user
        })
    }
    catch(e) {
        const error = new Error(`failed to create user: ${req.body.username} | error: ${e}`)
        next(error)
    }
}
// LOGIN USER WITH USERNAME & PASSWORD
export const userLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username }).populate('timelines')
        if (user.length === 0) {
            return res.status(401).json({
                type: "ERROR",
                message: `failed to find user with username: ${req.body.username}`
            })
        }
        // continue login if user is found
        // compare passwords
        const checkPassword = await bcrypt.compare(req.body.password, user.password)
        if (!checkPassword) {
            return res.status(401).json({
                type: "ERROR",
                message: "password did not match our records..."
            })
        }
        // if correct password, return user & JWT
        const token = jwt.sign({
            username: user.username,
            userId: user._id
        }, process.env.JWT_KEY, { expiresIn: '1h' })
        
        return res.status(200).json({
            type: "LOGIN",
            message: `logged in user: ${user.username}`,
            token,
            data: user
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: 'failed to login',
            data: e
        })
    }
}

// UPDATE SINGLE USER BY ID
export const updateSingleUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, {...req.body, updated_at: Date.now()}, { new: true })
        return res.json({
            type: "UPDATE",
            message: `updated user: ${updatedUser.username}`,
            data: updatedUser
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: "failed to update user",
            data: e
        })
    }
}

export const deleteSingleUser = async (req, res, next) => {
    try {
        // DELETE TIMELINES AND NODES FOR THIS USER
        const deletedUser = await User.findOneAndDelete({ _id: req.params.id })
        const timelines = deletedUser.timelines
        await Timeline.deleteMany({ _id: {$in: timelines} })
        await Node.deleteMany({ timeline: {$in: timelines} })
        
        return res.json({
            type: "DELETE",
            message: `deleted user: ${deletedUser.username}`,
            data: deletedUser
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: "failed to delete user",
            data: e
        })
    }
}