import { Router } from 'express'

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
    const user = await User.findOne({ _id: req.params.id })
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
router.post('/', async (req, res, next) => {
    const user = await new User({ ...req.body }).save()
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