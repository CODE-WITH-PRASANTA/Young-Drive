const Payment = require("../models/Payment");

// ==========================================
// GET ALL PAYMENTS
// ==========================================
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};


// ==========================================
// CREATE PAYMENT
// ==========================================
exports.createPayment = async (req, res) => {
  try {
    const {
      companyName,
      bookingId,
      customerName,
      customerEmail,
      amount,
      paymentMethod,
      paymentDetails,
      status,
      paymentDate,
    } = req.body;

    if (
      !companyName ||
      !bookingId ||
      !customerName ||
      !customerEmail ||
      amount === undefined ||
      !paymentDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required payment fields",
      });
    }

    const transactionId =
      "TXN" + Date.now().toString().slice(-10);

    const payment = new Payment({
      transactionId,
      companyName,
      bookingId,
      customerName,
      customerEmail,
      amount,
      paymentMethod,
      paymentDetails,
      status,
      paymentDate,
    });

    const savedPayment = await payment.save();

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: savedPayment,
    });
  } catch (error) {
    console.error("Create payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE PAYMENT
// ==========================================
exports.updatePayment = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const updatedPayment =
      await Payment.findOneAndUpdate(
        { transactionId },
        {
          ...req.body,
          amount: Number(req.body.amount),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Update payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update payment",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE PAYMENT
// ==========================================
exports.deletePayment = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const deletedPayment =
      await Payment.findOneAndDelete({
        transactionId,
      });

    if (!deletedPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
      data: deletedPayment,
    });
  } catch (error) {
    console.error("Delete payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete payment",
      error: error.message,
    });
  }
};