import { Node, Timeline } from '../models'

// GET ALL NODES FOR A GIVEN TIMELINE
export const getAllNodes = async (req, res, next) => {
    try {
        const nodes = await Node.find({ timeline: req.params.timelineId }).populate('timeline').exec()
        return res.json({
            type: "READ",
            message: `found all nodes for timeline: ${req.params.timelineId}`,
            data: nodes
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to find nodes for timeline: ${req.params.timelineId}`,
            data: e
        })
    }
}
// GET SINGLE NODE BY ID
export const getSingleNode = async (req, res, next) => {
    try {
        const node = await Node.findOne({ _id: req.params.id }).populate('timeline').exec()
        return res.json({
            type: "READ",
            message: `found node: ${req.params.id}`,
            data: node
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to find node: ${req.params.id}`,
            data: e
        })
    }
}

// CREATE SINGLE NODE
export const createNode = async (req, res, next) => {
    try {
        // find timeline from request body
        const timeline = await Timeline.findOne({ _id: req.body.timeline })
        // check user is author of this timeline
        if (!req.userData.userId === timeline.author) {
            const error = new Error('you are not the author of this timeline')
            next(error)
        }
        // create node with timeline id, add node id to timeline.nodes
        const node = await new Node({ ...req.body, timeline: timeline._id }).save()
        await timeline.nodes.push(node._id)
        timeline.updated_at = Date.now()
        await timeline.save()
    
        return res.json({
            type: "CREATE",
            message: `created node: ${node.title}`,
            data: node
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to create node: ${req.body.title}`,
            data: e
        })
    }
}

// UPDATE SINGLE NODE BY ID
export const updateNode = async (req, res, next) => {
    try {
        const updatedNode = await Node.findOneAndUpdate({ _id: req.params.id }, {...req.body, updated_at: Date.now()}, { new: true })
        const timeline = await Timeline.findOne({ _id: updatedNode.timeline })
        timeline.updated_at = Date.now()
        return res.json({
            type: "UPDATE",
            message: `updated node: ${updatedNode.title}`,
            data: updatedNode
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to update node: ${ req.params.id }`,
            data: e
        })
    }
}

// DELETE SINGLE NODE BY ID
export const deleteNode = async (req, res, next) => {
    try {
        // returns deleted document
        const deletedNode = await Node.findOneAndDelete({ _id: req.params.id })
        // find timeline that contained deletednode
        const timeline = await Timeline.findOne({ _id: deletedNode.timeline })
        // check user is author of this timeline
        if (!req.userData.userId === timeline.author) {
            const error = new Error('you are not the author of this timeline')
            next(error)
        }
        // remove node from timeline.nodes
        await timeline.nodes.pull(deletedNode._id)
        timeline.updated_at = Date.now()
        await timeline.save()

        return res.json({
            type: "DELETE",
            message: `deleted node: ${deletedNode.title}`,
            data: deletedNode
        })
    }
    catch(e) {
        return res.status(400).json({
            type: "ERROR",
            message: `failed to delete node: ${req.params.id}`,
            data: e
        })
    }
}