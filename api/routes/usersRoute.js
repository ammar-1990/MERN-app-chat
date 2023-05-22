
import express from 'express'
import { getUsers } from '../controllers/usersController.js'

const route = express.Router()


route.get('/',getUsers)


export default route