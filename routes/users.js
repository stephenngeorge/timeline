import { Router } from 'express'

// import models
import { User } from '../models'

const router = new Router()

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

router.post('/', async (req, res, next) => {
    const { username, password } = req.body
    const user = await new User({ username, password }).save()

    try {
        res.json({
            type: "CREATE",
            message: `created new user: ${user.username}`,
            user
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: "failed to create user",
            e
        })
    }
})

router.put('/:id', async (req, res, next) => {
    const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {...req.body, updated_at: Date.now()}, {new: true})
    try {
        res.json({
            type: "UPDATE",
            message: `successfully updated user: ${updatedUser.username}`,
            updatedUser
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

router.delete('/:id', async (req, res, next) => {
    const deletedUser = await User.findOneAndDelete({_id: req.params.id})
    try {
        res.json({
            type: "DELETE",
            message: `successfully deleted user: ${deletedUser.username}`,
            deletedUser
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