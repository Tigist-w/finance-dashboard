import express from "express";
import { authorize } from "../middleware/auth.js";
import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();
router.use(authorize);

router.get("/", getTransactions);
router.post("/", createTransaction);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
