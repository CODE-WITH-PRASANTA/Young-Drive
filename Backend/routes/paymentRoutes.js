const express = require("express");

const router = express.Router();

const {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} = require("../controllers/paymentController");

// GET ALL PAYMENTS
router.get("/", getPayments);

// CREATE PAYMENT
router.post("/", createPayment);

// UPDATE PAYMENT
router.put("/:transactionId", updatePayment);

// DELETE PAYMENT
router.delete("/:transactionId", deletePayment);

module.exports = router;