import mongoose,{Schema} from "mongoose";



const MessageSchema = new Schema(
    {
        message:{
            text:{type:String,required:true}
        },
    users:Array,
    sender:{
        type:Schema.Types.ObjectId,ref:"User",required:true
    },
    
},
{timestamps:true,}
);


export default mongoose.model('MessageModel',MessageSchema)