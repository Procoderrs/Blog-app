import mongoose from "mongoose";

const connectdb=async()=>{
  try {
    const connection=await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connnected: ${connection.connection.host}`);

  } catch (error) {
    console.log('mongo not connected :',error.message);
    process.exit(1)
  }
}

export default connectdb;