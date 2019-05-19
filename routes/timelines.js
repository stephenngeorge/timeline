import { Router } from 'express'

import verifyAuth from '../middleware/verifyAuth'
// import controllers
import { timelinesController } from '../controllers'

const router = new Router()

// GET ALL TIMELINES FOR GIVEN USER
router.get('/:userId', verifyAuth, timelinesController.getAllTimelines)
// GET SINGLE TIMELINE BY ID
router.get('/:id', verifyAuth, timelinesController.getSingleTimeline)

// CREATE NEW TIMELINE
router.post('/', verifyAuth, timelinesController.createTimeline)

// UPDATE SINGLE TIMELINE BY ID
router.put('/:id', verifyAuth, timelinesController.updateTimeline)
// ADD MEMBER TO TIMELINE.MEMBERS
router.put('/:id/addmember', verifyAuth, timelinesController.addMember)
// REMOVE MEMBER FROM TIMELINE.MEMBERS
router.put('/:id/deletemember', verifyAuth, timelinesController.removeMember)

// DELETE SINGLE TIMELINE BY ID
router.delete('/:id', verifyAuth, timelinesController.deleteTimeline)

export default router