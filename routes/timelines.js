import { Router } from 'express'

import verifyAuth from '../middleware/verifyAuth'

// import models
import { Timeline, User } from '../models'

const router = new Router()

// GET ALL TIMELINES FOR GIVEN USER
router.get('/:userId', verifyAuth, async (req, res, next) => {
    try {
        const timelines = await Timeline.find({ author: req.params.userId })
        res.json({
            type: "READ",
            message: `found all timelines for user: ${req.params.userId}`,
            data: timelines
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to find timelines for user: ${req.params.userId}`
        })
    }
})

// GET SINGLE TIMELINE BY ID
router.get('/:id', verifyAuth, async (req, res, next) => {
    try {
        const timeline = await Timeline.findOne({ _id: req.params.id }).populate('author').populate('nodes').exec()
        res.json({
            type: "READ",
            message: `found timeline: ${timeline.title}`,
            data: timeline
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to find timeline ${req.params.id}`
        })
    }
})

// CREATE NEW TIMELINE
router.post('/', verifyAuth, async (req, res, next) => {
    try {
        // find user from decoded token info
        const author = await User.findOne({ _id: req.userData.userId })
        // create timeline with author id, add timeline id to User author.timelines
        const timeline = await new Timeline({ ...req.body, author: author._id }).save()
        await author.timelines.push(timeline._id)
        await author.save()

        res.json({
            type: "CREATE",
            message: `created timeline: ${timeline.title}`,
            data: timeline
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to create timeline: ${req.body.title}`
        })
    }
})

// UPDATE SINGLE TIMELINE BY ID
router.put('/:id', verifyAuth, async (req, res, next) => {
    try {
        const updatedTimeline = await Timeline.findOneAndUpdate({ _id: req.params.id }, {...req.body, updated_at: Date.now()}, { new: true })
        res.json({
            type: "UPDATE",
            message: `updated timeline: ${updatedTimeline.title}`,
            data: updatedTimeline
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to update timeline: ${req.params.id}`
        })
    }
})
// ADD MEMBER TO TIMELINE.MEMBERS
router.put('/:id/addmember', verifyAuth, async (req, res, next) => {
    try {
        const timeline = await Timeline.findOne({ _id: req.params.id })
        await timeline.members.push(req.body.memberId)
        const updatedTimeline = await timeline.save()

        res.json({
            type: "UPDATE",
            message: `added member: ${req.params.id} to timeline: ${updatedTimeline.title}`,
            data: updatedTimeline
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to add member: ${req.params.id} to timeline: ${timeline.title}`
        })
    }
})
// REMOVE MEMBER FROM TIMELINE.MEMBERS
router.put('/:id/deletemember', verifyAuth, async (req, res, next) => {
    try {
        const timeline = await Timeline.findOne({ _id: req.params.id })
        await timeline.members.pull(req.body.memberId)
        const updatedTimeline = await timeline.save()

        res.json({
            type: "UPDATE",
            message: `removed member: ${req.params.id} from timeline: ${updatedTimeline.title}`,
            data: updatedTimeline
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to remove member ${req.params.id} from timeline: ${timeline.title}`
        })
    }
})

// DELETE SINGLE TIMELINE BY ID
router.delete('/:id', verifyAuth, async (req, res, next) => {
    try {
        const deletedTimeline = await Timeline.findOneAndDelete({ _id: req.params.id })
        res.json({
            type: "DELETE",
            message: `deleted timeline: ${deletedTimeline.title}`,
            data: deletedTimeline
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to delete timeline: ${req.params.id}`
        })
    }
})

export default router