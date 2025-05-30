import express from "express";
import {sql} from "../config/db.js";
import {
    createTransaction,
    deleteTransaction,
    getSummaryById,
    getTransactionById
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", getTransactionById)

router.get("/:userId", createTransaction)

router.delete("/:id", deleteTransaction)

router.get("/summary/:userId", getSummaryById)

export default router;