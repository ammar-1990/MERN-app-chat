import express from 'express'
import { addUser, logIn } from '../controllers/authController.js'

const router = express.Router()


router.post('/register',addUser)
router.post('/login',logIn)




export default router