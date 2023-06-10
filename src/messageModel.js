import mongoose, { Schema } from "mongoose";



const messageSchema = new Schema(
    {
        message: {
            textTitle: { type: String, required: true },
            text: { type: String, required: true }
        },
        users: Array,
        sender: {
            type: Schema.Types.ObjectId, ref: "User", required: true
        },

    },
    { timestamps: true, }
);


export default mongoose.model('messageModel', messageSchema)