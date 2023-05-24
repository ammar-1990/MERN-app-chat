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
import messagesRouter from './routes/messagesRoute.js'
import usersRouter from './routes/usersRoute.js'
import  fs from 'fs'
import path from 'path'

const app = express();
app.use(cookieParser());

app.use(cors({ origin: "https://main--glistening-puppy-1f4fc0.netlify.app", credentials: true }));
const __dirname = path.dirname(new URL(import.meta.url).pathname)
console.log(path.join(__dirname, 'uploads'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("database is started");
    const server = app.listen(8800, () => {
      console.log("server is running"); 
    });
app.get('/',(req,res)=>{
  res.status(200).send(path.join(__dirname, 'uploads'))
})
    const wss = new WebSocketServer({ server });
    wss.on("connection", (connection, req, res, next) => {
      const notifyUsers = ()=>{
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
  
      }
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
    
      


      notifyUsers()

    connection.on('close', () => {
      console.log('Client disconnected');
   
      notifyUsers()
    });
    connection.on('disconnected', () => {
      console.log('Client desdes');  
   
      notifyUsers()
    });
  


      //define people


      connection.on('message',async(message)=>{  



const theMessage = JSON.parse(message.toString()) 



const {reciever , text,file} = theMessage
let fileName=''
if(file){
 const ext = file.name.split('.').pop()
  fileName = Date.now() + '.'+ext

 const mypath =path.join(__dirname,'uploads',fileName)
 const bufferData = new Buffer(file.data.split(',')[1],'base64')
 fs.writeFile(mypath,bufferData,()=>{
  console.log('file saved')
 })
 console.log(mypath)
}  

if(reciever&& text || file){

 const message = await Message.create({sender:connection.userId,reciever,text,file:fileName });
 console.log(fileName);

  [...wss.clients].filter(el=>el.userId===reciever).forEach(el=>el.send(JSON.stringify({text,sender:connection.userId,id:message._id,reciever,file:fileName })))
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
app.use('/api/messages',messagesRouter)
app.use('/api/users',usersRouter)

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "something went wrong ";

  return res.status(errorStatus).send(errorMessage);
});
