import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";

// CREATE TRANSACTION
export const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, category, amount, date, description, account } = req.body;

    const tx = await Transaction.create({
      userId,
      type,
      category,
      amount,
      date,
      description,
      account,
    });

    // Update account balance
    const acc = await Account.findById(account);
    if (acc) {
      acc.balance = (acc.balance || 0) + (type === "income" ? amount : -amount);
      await acc.save();
    }

    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL TRANSACTIONS
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { start, end, type } = req.query;

    const filter = { userId };

    if (type) filter.type = type;

    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = new Date(start);
      if (end) filter.date.$lte = new Date(end);
    }

    const txs = await Transaction.find(filter)
      .populate("category")
      .populate("account")
      .sort("-date");

    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE
export const getTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id)
      .populate("account")
      .populate("category");

    if (!tx) return res.status(404).json({ message: "Not found" });

    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
