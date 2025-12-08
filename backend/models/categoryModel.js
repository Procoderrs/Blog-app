import mongoose from "mongoose";

const categorySchema =new mongoose.Schema({
  name:{type:String,
    required: true,
    unique:true,
  },
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userss", // make sure this matches your User model
    required: true,
    default:null,
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  createdAt:{
    type:Date,default:Date.now
  },
  
})

export default mongoose.model('Category',categorySchema);