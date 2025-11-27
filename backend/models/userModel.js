import mongoose from "mongoose";

const userSchemas=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
      type:String,
      required:true,
  },
  role:{
    type:String,enum:['admin','author','reader'],
    
    default:'author',
  },
  createdAt:{type:Date,default:Date.now}

},)
const User=mongoose.model('Userss',userSchemas);
export default User;