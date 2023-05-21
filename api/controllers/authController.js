import User from '../models/userModel.js'
import {createError} from '../util/createError.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'



 const addUser = async (req,res,next)=>{

    const exist = await User.findOne({username:req.body.username})
if (exist) return next(createError(401,'user already exists'))
try {
    const hash = bcrypt.hashSync(req.body.password, 5);

   const user =await User.create({...req.body,password:hash})
   const token = jwt.sign({userId:user._id,username:user.username},process.env.JWT_SECRET)

   const { password,...info} = user._doc
   res.cookie("accessToken", token, {httpOnly: true ,sameSite:'none',secure:true }).status(201).json(info);
} catch (error) {
  next(error)
}




}





const logIn = async (req,res,next)=>{


try {

 const user = await User.findOne({username:req.body.username})
 if(!user) return next(createError(404,'no such user'))

 const identical = bcrypt.compareSync(req.body.password,user.password)
 if(!identical) return next(createError(404,'username or password is invalid'))


 const token = jwt.sign({userId:user._id,username:user.username},process.env.JWT_SECRET)
 const { password,...info} = user._doc

 res.cookie("accessToken", token, {httpOnly: true ,sameSite:'none',secure:true }).status(201).json(info);
} catch (error) {
  next(error)
}

}
export  {addUser,logIn}