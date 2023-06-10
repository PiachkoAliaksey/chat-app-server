import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {Server} from 'socket.io';

import { registerValidation, loginValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { signUp, login, getMe,getAllUsers,getNewUser} from './controllers/userController.js';
import { addMessage,getAllMessage } from './controllers/messageController.js';


mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('DB OK'))
    .catch((error) => console.log('DB error', error));

const app = express();

app.use(cors());
app.use(express.json());



app.post('/auth/login', loginValidation, login);
app.post('/auth/signup', registerValidation, signUp);
app.get('/auth/me', checkAuth, getMe);
app.post('/auth/newUser', getNewUser);
app.get('/allUsers/:id', getAllUsers);
app.post('/addmsg',addMessage );
app.post('/getallmsg',getAllMessage );


const server = app.listen(process.env.PORT||4444, () => {
    return console.log('Server OK');
})

const io = new Server(server,{
    cors:{
        origin:"https://chat-app-front-hyon.onrender.com",
        credentials:true,
    }
})
global.onlineUsers = new Map();

io.on('connection',(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id)
    })
    socket.on('send-msg',(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit('msg-receive',data);
        }
    })
})