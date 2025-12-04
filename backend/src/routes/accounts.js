import express from "express";
import Account from "../models/Account.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

// Get all accounts for current user
router.get("/", authorize, async (req, res) => {
  const accs = await Account.find({ userId: req.user.id });
  res.json(accs);
});

// Create account
router.post("/", authorize, async (req, res) => {
  const { name, balance, currency, type } = req.body;
  const a = await Account.create({
    name,
    balance,
    currency,
    type,
    userId: req.user.id, // associate with logged-in user
  });
  res.status(201).json(a);
});

// Update account (only for owner)
router.put("/:id", authorize, async (req, res) => {
  const { name, type, currency, balance } = req.body;
  const acc = await Account.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { name, type, currency, balance },
    { new: true }
  );
  res.json(acc);
});

// Delete account (only for owner)
router.delete("/:id", authorize, async (req, res) => {
  await Account.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: "Account deleted" });
});

export default router;
