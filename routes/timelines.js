import { Router } from 'express'

import { verifyAuth, verifyPassword } from '../middleware'
// import controllers
import { timelinesController } from '../controllers'

const router = new Router()

// GET ALL TIMELINES FOR GIVEN USER
router.get('/user/:userId', verifyAuth, timelinesController.getAllTimelines)
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
// ADD TAG TO TIMELINE.TAGS
router.put('/:id/addtag', verifyAuth, timelinesController.addTag)
// REMOVE TAG FROM TIMELINE.TAGS
router.put('/:id/deletetag', verifyAuth, timelinesController.deleteTag)

// DELETE SINGLE TIMELINE BY ID
router.delete('/:id', verifyAuth, verifyPassword, timelinesController.deleteTimeline)

export default router