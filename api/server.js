import express from "express";
import "dotenv/config";
import authRouter from "./routes/authRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { WebSocketServer } from "ws";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { createError } from "./util/createError.js";
import Message from './models/messageModel.js'

const app = express();
app.use(cookieParser());
app.use(cors({ origin: "http://127.0.0.1:5173", credentials: true }));

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("database is started");
    const server = app.listen(8800, () => {
      console.log("server is running");
    });

    const wss = new WebSocketServer({ server });
    wss.on("connection", (connection, req, res, next) => {
      const { cookie } = req.headers;
      if (cookie) {
        const accessTokenString = cookie
          .split(";")
          .find((el) => el.startsWith("accessToken="));
        const accessToken = accessTokenString.split("=")[1];
        if (accessToken) {
          jwt.verify(accessToken, process.env.JWT_SECRET, (err, payload) => {
            if (err) return next(createError(401, "token is not valid"));
            connection.userId = payload.userId;
            connection.username = payload.username;
            // console.log(connection.userId, connection.username);
          });
        }
      }
    

      //define people
      [...wss.clients].forEach((el) => {
        el.send(
          JSON.stringify({
            online: [...wss.clients].map((client) => ({
              userId: client.userId,
              username: client.username,
            })),
          })
        );
      });
      connection.on('message',async(message)=>{
const theMessage = JSON.parse(message.toString())
console.log(theMessage)
const {reciever , text} = theMessage

if(reciever&& text){

 const message = await Message.create({sender:connection.userId,reciever,text});

  [...wss.clients].filter(el=>el.userId===reciever).forEach(el=>el.send(JSON.stringify({text,sender:connection.userId,id:message._id})))
}
   
      })


    });

 




  })
  .catch((err) => console.log(err));

app.get("/api", (req, res) => {
  res.send("done");
});

app.use(express.json());
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "something went wrong ";

  return res.status(errorStatus).send(errorMessage);
});
