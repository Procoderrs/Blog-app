import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: {
  type: String,
  required: true,
  unique: true,
  index: true,
},
  short_desc: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  image: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Userss" },
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate slug before saving
postSchema.pre("validate", async function (next) {
  if (!this.title) return next();

  if (!this.slug || this.isModified("title")) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (
      await mongoose.models.postschemaaa.findOne({
        slug,
        _id: { $ne: this._id },
      })
    ) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }

  next();
});


const POSTSCHEMA = mongoose.model("postschemaaa", postSchema);
export default POSTSCHEMA;
