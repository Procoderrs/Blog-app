import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
  title:{type:String, required:true},
  short_desc:{type:String,required:true},
  content:{type:String,required:true},
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  image: { type: String,required:true },  // <-- only string (no req.file here)
  author:{type:mongoose.Schema.Types.ObjectId, ref:'Userss'},
  createdAt:{type:Date,default:Date.now()}
})
 const POSTSCHEMA=mongoose.model('postschemaaa',postSchema);
export default POSTSCHEMA;