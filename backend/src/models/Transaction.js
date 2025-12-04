import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  description: { type: String },
  type: { type: String, enum: ["income", "expense"] },
  amount: { type: Number },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", TransactionSchema);
