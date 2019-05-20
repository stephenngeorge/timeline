import { Router } from 'express'

// import middleware
import { verifyAuth, verifyPassword } from '../middleware'
// import controllers
import { nodesController } from '../controllers'

const router = new Router()

// GET ALL NODES FOR A GIVEN TIMELINE
router.get('/:timelineId', verifyAuth, nodesController.getAllNodes)
// GET SINGLE NODE BY ID
router.get('/:id', verifyAuth, nodesController.getSingleNode)

// CREATE SINGLE NODE
router.post('/', verifyAuth, nodesController.createNode)

// UPDATE SINGLE NODE BY ID
router.put('/:id', verifyAuth, nodesController.updateNode)

// DELETE SINGLE NODE BY ID
router.delete('/:id', verifyAuth, verifyPassword, nodesController.deleteNode)

export default router