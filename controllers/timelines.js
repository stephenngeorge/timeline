import { Node, Timeline, User } from '../models'

// GET ALL TIMELINES FOR A GIVEN USER
export const getAllTimelines = async (req, res, next) => {
    try {
        const timelines = await Timeline.find({ author: req.params.userId })
        return res.json({
            type: "READ",
            message: `found all timelines for user: ${req.params.userId}`,
            data: timelines
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to find timelines for user: ${req.params.userId}`,
            data: e
        })
    }
}
// GET SINGLE TIMELINE BY ID
export const getSingleTimeline = async (req, res, next) => {
    try {
        const timeline = await Timeline.findOne({ _id: req.params.id }).populate('author').populate('nodes').exec()
        return res.json({
            type: "READ",
            message: `found timeline: ${timeline.title}`,
            data: timeline
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to find timeline ${req.params.id}`,
            data: e
        })
    }
}

// CREATE NEW TIMELINE
export const createTimeline = async (req, res, next) => {
    try {
        // find user from decoded token info
        const author = await User.findOne({ _id: req.userData.userId })
        // create timeline with author id, add timeline id to User author.timelines
        const timeline = await new Timeline({ ...req.body, author: author._id }).save()
        await author.timelines.push(timeline._id)
        await author.save()

        return res.json({
            type: "CREATE",
            message: `created timeline: ${timeline.title}`,
            data: timeline
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to create timeline: ${req.body.title}`,
            data: e
        })
    }
}

// UPDATE SINGLE TIMELINE BY id
export const updateTimeline = async (req, res, next) => {
    try {
        const updatedTimeline = await Timeline.findOneAndUpdate({ _id: req.params.id }, {...req.body, updated_at: Date.now()}, { new: true })
        // check user is author of this timeline
        if (!req.userData.userId === updatedTimeline.author) {
            const error = new Error('you are not the author of this timeline')
            next(error)
        }
        return res.json({
            type: "UPDATE",
            message: `updated timeline: ${updatedTimeline.title}`,
            data: updatedTimeline
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to update timeline: ${req.params.id}`,
            data: e
        })
    }
}

// ADD MEMBER TO TIMELINE
export const addMember = async (req, res, next) => {
    try {
        const timeline = await Timeline.findOne({ _id: req.params.id })
        // check user is author of this timeline
        if (!req.userData.userId === timeline.author) {
            const error = new Error('you are not the author of this timeline')
            next(error)
        }
        await timeline.members.push(req.body.memberId)
        timeline.updated_at = Date.now()
        const updatedTimeline = await timeline.save()

        return res.json({
            type: "UPDATE",
            message: `added member: ${req.params.id} to timeline: ${updatedTimeline.title}`,
            data: updatedTimeline
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to add member: ${req.params.id} to timeline: ${timeline.title}`,
            data: e
        })
    }
}
// REMOVE MEMBER FROM TIMELINE
export const removeMember = async (req, res, next) => {
    try {
        const timeline = await Timeline.findOne({ _id: req.params.id })
        // check user is author of this timeline
        if (!req.userData.userId === timeline.author) {
            const error = new Error('you are not the author of this timeline')
            next(error)
        }
        await timeline.members.pull(req.body.memberId)
        timeline.updated_at = Date.now()
        const updatedTimeline = await timeline.save()

        return res.json({
            type: "UPDATE",
            message: `removed member: ${req.body.memberId} from timeline: ${updatedTimeline.title}`,
            data: updatedTimeline
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to remove member ${req.params.id} from timeline: ${timeline.title}`,
            data: e
        })
    }
}

// ADD TAG TO TIMELINE
export const addTag = async (req, res, next) => {
    try {
        const timeline = await Timeline.findOne({ _id: req.params.id })
        // check user is author of this timeline
        if (!req.userData.userId === timeline.author) {
            const error = new Error('you are not the author of this timeline')
            next(error)
        }
        await timeline.tags.push(req.body.tag)
        timeline.updated_at = Date.now()
        const updatedTimeline = await timeline.save()

        return res.json({
            type: "UPDATE",
            message: `added tag: ${req.body.tag} to timeline: ${updatedTimeline._id}`,
            data: updatedTimeline
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to add tag: ${req.body.tag} to timeline: ${timeline._id}`,
            data: e
        })
    }
}
// REMOVE TAG FROM TIMELINE
export const deleteTag = async (req, res, next) => {
    try {
        const timeline = await Timeline.findOne({ _id: req.params.id })
        // check user is author of this timeline
        if (!req.userData.userId === timeline.author) {
            const error = new Error('you are not the author of this timeline')
            next(error)
        }
        await timeline.tags.pull(req.body.tag)
        timeline.updated_at = Date.now()
        const updatedTimeline = await timeline.save()

        return res.json({
            type: "UPDATE",
            message: `deleted tag: ${req.body.tag} from timeline: ${updatedTimeline._id}`,
            data: updatedTimeline
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to delete tag: ${req.body.tag} from timeline: ${timeline._id}`,
            data: e
        })
    }
}

// DELETE TIMELINE BY ID
export const deleteTimeline = async (req, res, next) => {
    try {
        // delete all nodes from this timeline
        await Node.deleteMany({ timeline: req.params.id })
        // delete timeline
        const deletedTimeline = await Timeline.findOneAndDelete({ _id: req.params.id })
        // remove timeline from author.timelines
        const author = await User.findOne({ _id: deletedTimeline.author })
        await author.timelines.pull(deletedTimeline._id)
        await author.save()

        return res.json({
            type: "DELETE",
            message: `deleted timeline: ${deletedTimeline.title}`,
            data: deletedTimeline
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to delete timeline: ${req.params.id}`,
            data: e
        })
    }
}