import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import socket from 'socket.io';

import { registerValidation, loginValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import { signIn, login, getMe,getAllUsers,deleteOne , update} from './controllers/userController.js';
import { addMessage,getAllMessage } from './controllers/messageController.js';

const MONGO_URL = 'mongodb+srv://pechkoaleks:kMBCbcWIXBe3MiaJ@datacloud.w2wnoou.mongodb.net/chatApp?retryWrites=true&w=majority';
mongoose
    .connect(MONGO_URL)
    .then(() => console.log('DB OK'))
    .catch((error) => console.log('DB error', error));

const app = express();

app.use(cors());
app.use(express.json());



app.post('/auth/login', loginValidation, login);
app.post('/auth/register', registerValidation, signIn);
app.get('/auth/me', checkAuth, getMe);
app.get('/auth/allUsers/:id', getAllUsers);
app.post('/addmsg',addMessage );
app.post('/getallmsg',getAllMessage );


const server = app.listen(process.env.PORT||4444, () => {
    return console.log('Server OK');
})

const io = socket(server,{
    cors:{
        origin:"http://localhost:3000",
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
            socket.to(sendUserSocket).emit('msg-receive',data.message);
        }
    })
})