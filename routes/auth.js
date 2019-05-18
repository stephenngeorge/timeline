import { Router } from 'express'
const router = new Router()

// import middleware
import { verifyAuth, verifyPassword } from '../middleware'
// import controllers
import { authController } from '../controllers'

// GET USER COUNT
router.get('/', authController.userCount)
// GET SINGLE USER BY ID
router.get('/:id', authController.getSingleUser)

// CREATE NEW USER
router.post('/signup', authController.userSignUp)
// USER LOGIN, RETURNING JWT & USER OBJECT
router.post('/login', authController.userLogin)

// UPDATE SINGLE USER BY ID
router.put('/:id', verifyAuth, authController.updateSingleUser)

// DELETE SINGLE USER BY ID
router.delete('/:id', verifyAuth, verifyPassword, authController.deleteSingleUser)

export default router