import { Router } from 'router'

// import models
import { Node } from '../models'

const router = new Router()

// GET ALL NODES FOR A GIVEN TIMELINE
router.get('/:timelineId', async (req, res, next) => {
    const nodes = await Node.find({ timeline: req.params.timelineId })
    try {
        res.json({
            type: "READ",
            message: `found all nodes for timeline: ${req.params.timelineId}`,
            data: nodes
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to find nodes for timeline: ${req.params.timelineId}`,
            e
        })
    }
})

// GET SINGLE NODE BY ID
router.get('/:id', async (req, res, next) => {
    const node = await Node.findOne({ _id: req.params.id })
    try {
        res.json({
            type: "READ",
            message: `found node: ${req.params.id}`,
            data: node
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to find node: ${req.params.id}`,
            e
        })
    }
})

// CREATE SINGLE NODE
router.post('/', async (req, res, next) => {
    const node = await new Node({ ...req.body }).save()
    try {
        res.json({
            type: "CREATE",
            message: `created node: ${node.title}`,
            data: node
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to create node: ${req.body.title}`,
            e
        })
    }
})

// UPDATE SINGLE NODE BY ID
router.put('/:id', async (req, res, next) => {
    const updatedNode = await Node.findOneAndUpdate({ _id: req.params.id }, {...req.body, updated_at: Date.now()}, { new: true })
    try {
        res.json({
            type: "UPDATE",
            message: `updated node: ${updatedNode.title}`,
            data: updatedNode
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to update node: ${ req.params.id }`,
            e
        })
    }
})

// DELETE SINGLE NODE BY ID
router.delete('/:id', (req, res, next) => {
    const deletedNode = await Node.findOneAndDelete({ _id: req.params.id })
    try {
        res.json({
            type: "DELETE",
            message: `deleted node: ${deletedNode.title}`,
            data: deletedNode
        })
    }
    catch(e) {
        res.status(400).json({
            type: "ERROR",
            message: `failed to delete node: ${req.params.id}`,
            e
        })
    }
})

export default router