const express = require("express");

const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentSummary,
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* =====================================================
   ALL PAYMENT ROUTES ARE PROTECTED
===================================================== */

router.use(protect);

/* =====================================================
   PAYMENT SUMMARY

   GET /api/payments/summary
===================================================== */

router.get(
  "/summary",
  getPaymentSummary
);

/* =====================================================
   CREATE PAYMENT

   POST /api/payments
===================================================== */

router.post(
  "/",
  createPayment
);

/* =====================================================
   GET ALL PAYMENTS

   GET /api/payments

   Supports:

   ?search=
   ?status=
   ?method=
   ?type=
   ?page=
   ?limit=
   ?startDate=
   ?endDate=
===================================================== */

router.get(
  "/",
  getAllPayments
);

/* =====================================================
   GET SINGLE PAYMENT

   GET /api/payments/:id
===================================================== */

router.get(
  "/:id",
  getPaymentById
);

/* =====================================================
   UPDATE PAYMENT

   PUT /api/payments/:id
===================================================== */

router.put(
  "/:id",
  updatePayment
);

/* =====================================================
   DELETE PAYMENT

   DELETE /api/payments/:id
===================================================== */

router.delete(
  "/:id",
  deletePayment
);

module.exports = router;