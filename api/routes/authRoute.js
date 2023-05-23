import express from 'express'
import { addUser, logIn, logOut } from '../controllers/authController.js'

const router = express.Router()


router.post('/register',addUser)
router.post('/login',logIn)
router.post('/logout',logOut)




export default router