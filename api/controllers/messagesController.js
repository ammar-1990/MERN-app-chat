import mongoose from "mongoose"
import { createError } from "../util/createError.js"
import Message from '../models/messageModel.js'



const getMessages = async (req,res,next) =>{
const {id} = req.params
if(!mongoose.isValidObjectId(id)) return next(createError(401,'not valid id'))


try {

    
    const messages = await Message.find({
        sender:{$in:[id,req.userId]},
        reciever:{$in:[id,req.userId]}
    })
    
    
    
    res.status(200).json(messages)
} catch (error) {
    next(error)
}




}








export {getMessages}