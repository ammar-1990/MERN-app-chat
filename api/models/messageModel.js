import mongoose from "mongoose";


const MessageSchema = mongoose.Schema({
sender:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
reciever:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
text:String

},{timestamps:true})

export default mongoose.model('Message',MessageSchema)