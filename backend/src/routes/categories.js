import express from "express";
import Category from "../models/Category.js";
import { authorize } from "../middleware/auth.js";
const router = express.Router();

// Get all categories
router.get("/", authorize, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create category
router.post("/", authorize, async (req, res) => {
  const { name, type } = req.body;
  try {
    const cat = await Category.create({
      name,
      type,
      userId: req.user.id,
    });
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update category
router.put("/:id", authorize, async (req, res) => {
  const { name, type } = req.body;
  try {
    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      { name, type },
      { new: true }
    );
    res.json(cat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete category
router.delete("/:id", authorize, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
