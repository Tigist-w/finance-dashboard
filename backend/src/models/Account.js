import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // <-- add this
  name: { type: String, required: true },
  type: { type: String, default: "checking" },
  currency: { type: String, default: "USD" },
  balance: { type: Number, default: 0 },
});

export default mongoose.model("Account", AccountSchema);
