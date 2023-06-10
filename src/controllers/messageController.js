import messageModel from "../messageModel.js";

export const addMessage = async (req, res, next) => {
    try {
        const { from, to, message, title } = req.body;
        const data = await messageModel.create({
            message: { textTitle:title, text: message },
            users: [from, to],
            sender: from,

        });
        if (data) {
            res.json({ msg: "sent successfully" });
        }else{
            res.json({ msg: "Failed to add message to database" });
        }
    } catch (err) {
        next(err)
    }
}

export const getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        if(from===to){
            const messages = await messageModel.find({
                "$expr": {
                    "$eq": [
                      { "$arrayElemAt": ["$users", 0] },
                      { "$arrayElemAt": ["$users", 1] }
                    ]
                  }
            }).find({
                users: {
                    $all: [from, to]
                }
            }).sort({ updatedAt: 1 });
            const projectMessages = messages.map((msg) => {
                return {
                    fromSelf: msg.sender.toString() === from,
                    title:msg.message.textTitle,
                    message: msg.message.text,
                    created: msg.createdAt.toString().slice(16, 25)
                }
            })
            res.json(projectMessages)
            
        }else{
            const messages = await messageModel.find({
                users: {
                    $all: [from, to]
                }
            }).sort({ updatedAt: 1 });
            
            const projectMessages = messages.map((msg) => {
                return {
                    fromSelf: msg.sender.toString() === from,
                    title:msg.message.textTitle,
                    message: msg.message.text,
                    created: msg.createdAt.toString().slice(16, 25)
                }
            })
            res.json(projectMessages)
        } 
        
    } catch (err) {
        next(err)
    }
}