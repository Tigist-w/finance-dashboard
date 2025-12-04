import Transaction from "../models/Transaction.js";
import Category from "../models/Category.js";

export const summary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Last 6 months trend
    const months = 6;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const txs = await Transaction.find({
      userId,
      date: { $gte: start },
    }).populate("category");

    // Build trend map
    const trendMap = {};
    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      trendMap[key] = { month: key, income: 0, expense: 0 };
    }

    txs.forEach((t) => {
      const key = t.date.toISOString().slice(0, 7);
      if (!trendMap[key]) return;
      if (t.type === "income") trendMap[key].income += t.amount;
      else trendMap[key].expense += t.amount;
    });

    const trend = Object.values(trendMap).reverse();

    // Category breakdown for expense
    const categories = {};
    txs.forEach((t) => {
      const catName = t.category ? t.category.name : "Uncategorized";
      if (t.type === "expense") {
        categories[catName] = (categories[catName] || 0) + t.amount;
      }
    });

    const categoryBreakdown = Object.entries(categories).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    // Totals
    const totalIncome = txs
      .filter((t) => t.type === "income")
      .reduce((sum, n) => sum + n.amount, 0);

    const totalExpense = txs
      .filter((t) => t.type === "expense")
      .reduce((sum, n) => sum + n.amount, 0);

    // Recent transactions
    const recent = await Transaction.find({ userId })
      .sort("-date")
      .limit(10)
      .populate("category");

    // Send response
    res.json({ trend, categoryBreakdown, totalIncome, totalExpense, recent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
