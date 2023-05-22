

import { createError } from "../util/createError.js";
import User from '../models/userModel.js'


export const getUsers = async(req,res,next)=>{


    try {
        const users = await User.find()

        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}