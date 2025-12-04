import mongoose from "mongoose";
const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  month: { type: String }, // YYYY-MM
  limit: { type: Number },
});
export default mongoose.model("Budget", BudgetSchema);
