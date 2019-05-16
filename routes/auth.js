import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// import models
import { User } from '../models'

const router = new Router()

// GET USER COUNT
router.get('/', async (req, res, next) => {
    const users = await User.find()
    try {
        res.send(`user count: ${users.length}`)
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: "failed to fetch users"
        })
    }
})

// GET SINGLE USER BY ID
router.get('/:id', async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id }).populate('timelines').exec()
    try {
        res.json({
            type: "READ",
            message: `found user: ${user.username}`,
            data: user
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to find user: ${req.params.id}`,
            e
        })
    }
})

// CREATE NEW USER
router.post('/signup', async (req, res, next) => {
    // check username availability
    const checkUsername = await User.find({ username: req.body.username })
    if (checkUsername.length !== 0) {
        return res.status(400).json({
            type: "ERROR",
            message: `username: ${req.body.username} is taken`
        })
    }
    // create user if username is available
    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    // create new user
    const user = await new User({ ...req.body, password: hashedPassword }).save()
    try {
        res.json({
            type: "CREATE",
            message: `created new user: ${user.username}`,
            data: user
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to create user: ${req.body.username}`,
            e
        })
    }
})

// USER LOGIN, RETURNING JWT & USER OBJECT
router.post('/login', async (req, res, next) => {
    const user = await User.find({ username: req.body.username })
    if (user.length === 0) {
        return res.status(401).json({
            type: "ERROR",
            message: `failed to find user with username: ${req.body.username}`
        })
    }
    // continue login if user is found
    // compare passwords
    const checkPassword = await bcrypt.compare(req.body.password, user[0].password)
    if (!checkPassword) {
        return res.status(401).json({
            type: "ERROR",
            message: "password did not match our records..."
        })
    }
    // if correct password, return user & JWT
    const token = jwt.sign({
        username: user[0].username,
        userId: user[0]._id
    }, process.env.JWT_KEY, { expiresIn: '1h' })
    res.status(200).json({
        type: "LOGIN",
        message: `logged in user: ${user[0].username}`,
        token,
        data: user[0]
    })
})

// UPDATE SINGLE USER BY ID
router.put('/:id', async (req, res, next) => {
    const updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, {...req.body, updated_at: Date.now()}, { new: true })
    try {
        res.json({
            type: "UPDATE",
            message: `updated user: ${updatedUser.username}`,
            data: updatedUser
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: "failed to update user",
            e
        })
    }
})

// DELETE SINGLE USER BY ID
router.delete('/:id', async (req, res, next) => {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id })
    try {
        res.json({
            type: "DELETE",
            message: `deleted user: ${deletedUser.username}`,
            data: deletedUser
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: "failed to delete user",
            e
        })
    }
})

export default router