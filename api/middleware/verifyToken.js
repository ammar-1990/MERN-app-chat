import { createError } from "../util/createError"
import jwt from 'jsonwebtoken'




export const verifyToken = async (req,res,next) =>{

const token = req.cookies.accessToken
if(!token) return next(createError(401,'not authenticated'))


jwt.verify(token,process.env.JWT_SECRET,async (err,payload)=>{

    if(err) return next(createError(404,'token is not valid'))

    req.userId = payload.userId;
    req.username = payload.username
})

next()

}