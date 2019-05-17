import { Router } from 'express'

import verifyAuth from '../middleware/verifyAuth'

// import models
import { Timeline } from '../models'

const router = new Router()

// GET ALL TIMELINES FOR GIVEN USER
router.get('/:userId', verifyAuth, async (req, res, next) => {
    const timelines = await Timeline.find({ author: req.params.userId })
    try {
        res.json({
            type: "READ",
            message: `found all timelines for user: ${req.params.userId}`,
            data: timelines
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to find timelines for user: ${req.params.userId}`,
            e
        })
    }
})

// GET SINGLE TIMELINE BY ID
router.get('/:id', verifyAuth, async (req, res, next) => {
    const timeline = await Timeline.findOne({ _id: req.params.id }).populate('author').populate('nodes').exec()
    try {
        res.json({
            type: "READ",
            message: `found timeline: ${timeline.title}`,
            data: timeline
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to find timeline ${req.params.id}`,
            e
        })
    }
})

// CREATE NEW TIMELINE
router.post('/', verifyAuth, async (req, res, next) => {
    const timeline = await new Timeline({ ...req.body }).save()
    try {
        res.json({
            type: "CREATE",
            message: `created timeline: ${timeline.title}`,
            data: timeline
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to create timeline: ${req.body.title}`,
            e
        })
    }
})

// UPDATE SINGLE TIMELINE BY ID
router.put('/:id', verifyAuth, async (req, res, next) => {
    const updatedTimeline = await Timeline.findOneAndUpdate({ _id: req.params.id }, {...req.body, updated_at: Date.now()}, { new: true })
    try {
        res.json({
            type: "UPDATE",
            message: `updated timeline: ${updatedTimeline.title}`,
            data: updatedTimeline
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to update timeline: ${req.params.id}`,
            e
        })
    }
})

// DELETE SINGLE TIMELINE BY ID
router.delete('/:id', verifyAuth, async (req, res, next) => {
    const deletedTimeline = await Timeline.findOneAndDelete({ _id: req.params.id })
    try {
        res.json({
            type: "DELETE",
            message: `deleted timeline: ${deletedTimeline.title}`,
            data: deletedTimeline
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to delete timeline: ${req.params.id}`,
            e
        })
    }
})

export default router