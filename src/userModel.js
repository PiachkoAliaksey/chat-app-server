import mongoose,{Schema} from "mongoose";



const UserSchema = new Schema({
    fullName:{type:String,required:true,unique:true},
}
,{timestamps:true,});


export default mongoose.model('UserModel',UserSchema)