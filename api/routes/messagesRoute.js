import express from 'express'
import { getMessages } from '../controllers/messagesController.js'
import {verifyToken}  from '../middleware/verifyToken.js'


const route = express.Router()



route.get('/:id',verifyToken,getMessages)


export default route