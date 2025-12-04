import express from "express";
import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

// GET budgets with optional month filter
router.get("/", authorize, async (req, res) => {
  const { month } = req.query;
  const filter = { userId: req.user.id };
  if (month) filter.month = month;

  try {
    const budgets = await Budget.find(filter).populate("categoryId");
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
});

// POST create budget
router.post("/", authorize, async (req, res) => {
  const { categoryId, month, limit } = req.body;
  try {
    const budget = await Budget.create({
      userId: req.user.id,
      categoryId,
      month,
      limit,
    });
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: "Failed to create budget" });
  }
});

// PUT update budget
router.put("/:id", authorize, async (req, res) => {
  const { categoryId, month, limit } = req.body;
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { categoryId, month, limit },
      { new: true }
    ).populate("categoryId");
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: "Failed to update budget" });
  }
});

// DELETE budget
router.delete("/:id", authorize, async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete budget" });
  }
});

// GET budgets with actual spending
router.get("/summary/:month", authorize, async (req, res) => {
  const { month } = req.params;
  try {
    const budgets = await Budget.find({ userId: req.user.id, month }).populate(
      "categoryId"
    );
    const txs = await Transaction.find({ type: "expense" }).populate(
      "category account"
    );

    const summary = budgets.map((b) => {
      const spent = txs
        .filter(
          (t) => t.category?._id.toString() === b.categoryId._id.toString()
        )
        .reduce((acc, t) => acc + t.amount, 0);
      return {
        _id: b._id,
        category: b.categoryId.name,
        limit: b.limit,
        spent,
      };
    });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch budget summary" });
  }
});

export default router;
