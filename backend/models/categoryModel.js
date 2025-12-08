import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  // WHO CREATED THIS CATEGORY
  // null or undefined means: admin-created global category
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userss",
    required: false,  // must NOT be required
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Category", categorySchema);
