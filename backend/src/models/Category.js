import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if categories are user-specific
});

export default mongoose.model("Category", CategorySchema);
