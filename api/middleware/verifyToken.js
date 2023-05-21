import { createError } from "../util/createError.js"
import jwt from 'jsonwebtoken'




export const verifyToken = async (req,res,next) =>{
const {cookie} = req.headers
if (cookie) {
    const accessTokenString = cookie
      .split(";")
      .find((el) => el.startsWith("accessToken="));
    const accessToken = accessTokenString.split("=")[1];
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_SECRET, (err, payload) => {
        if (err) return next(createError(401, "token is not valid"));
        req.userId = payload.userId ;
        req.username = payload.username;
        // console.log(connection.userId, connection.username);
      });
    }
  }



next()

}

