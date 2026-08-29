const Payment = require("../models/Payment");

/* =====================================================
   GENERATE TRANSACTION ID
===================================================== */

const generateTransactionId = async () => {
  let transactionId;
  let exists = true;

  while (exists) {
    transactionId = `TXN${Date.now()
      .toString()
      .slice(-8)}${Math.floor(Math.random() * 10)}`;

    exists = await Payment.exists({
      transactionId,
    });
  }

  return transactionId;
};

/* =====================================================
   GET PAYMENT BRAND
===================================================== */

const getPaymentBrand = (method, details = "") => {
  const paymentMethod = method?.toLowerCase() || "";
  const paymentDetails = details?.toLowerCase() || "";

  if (paymentMethod === "credit card") {
    return "visa";
  }

  if (paymentMethod === "debit card") {
    return "mastercard";
  }

  if (paymentMethod === "paypal") {
    return "paypal";
  }

  if (paymentMethod === "upi") {
    if (
      paymentDetails.includes("google") ||
      paymentDetails.includes("gpay") ||
      paymentDetails.includes("google pay")
    ) {
      return "google";
    }

    if (
      paymentDetails.includes("phone") ||
      paymentDetails.includes("phonepe")
    ) {
      return "phonepe";
    }

    return "upi";
  }

  if (paymentMethod === "net banking") {
    return "bank";
  }

  if (paymentMethod === "cash") {
    return "cash";
  }

  return "payment";
};

/* =====================================================
   CREATE PAYMENT
===================================================== */

const createPayment = async (req, res) => {
  try {
    const {
      transactionId,
      bookingId,
      customerName,
      customerEmail,
      amount,
      method,
      details,
      brand,
      status,
      paymentDate,
      date,
    } = req.body;

    /* -----------------------------------------------
       VALIDATION
    ----------------------------------------------- */

    if (
      !bookingId ||
      !customerName ||
      !customerEmail ||
      amount === undefined ||
      amount === null ||
      !method ||
      !paymentDate && !date
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Booking ID, customer name, email, amount, method and payment date are required",
      });
    }

    const numericAmount = Number(amount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid positive number",
      });
    }

    /* -----------------------------------------------
       EMAIL VALIDATION
    ----------------------------------------------- */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(customerEmail.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid customer email",
      });
    }

    /* -----------------------------------------------
       VALIDATE METHOD
    ----------------------------------------------- */

    const allowedMethods = [
      "UPI",
      "Credit Card",
      "Debit Card",
      "PayPal",
      "Net Banking",
      "Cash",
    ];

    if (!allowedMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    /* -----------------------------------------------
       VALIDATE STATUS
    ----------------------------------------------- */

    const allowedStatuses = [
      "Successful",
      "Pending",
      "Failed",
      "Refunded",
    ];

    const paymentStatus =
      status || "Pending";

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    /* -----------------------------------------------
       PAYMENT DATE
    ----------------------------------------------- */

    const finalPaymentDate =
      paymentDate || date;

    const parsedDate =
      new Date(finalPaymentDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment date",
      });
    }

    /* -----------------------------------------------
       TRANSACTION ID
    ----------------------------------------------- */

    const finalTransactionId =
      transactionId?.trim().toUpperCase() ||
      (await generateTransactionId());

    const existingTransaction =
      await Payment.findOne({
        transactionId: finalTransactionId,
      });

    if (existingTransaction) {
      return res.status(409).json({
        success: false,
        message: "Transaction ID already exists",
      });
    }

    /* -----------------------------------------------
       BRAND
    ----------------------------------------------- */

    const finalBrand =
      brand ||
      getPaymentBrand(
        method,
        details
      );

    /* -----------------------------------------------
       CREATE PAYMENT
    ----------------------------------------------- */

    const payment =
      await Payment.create({
        transactionId:
          finalTransactionId,

        bookingId:
          bookingId.trim().toUpperCase(),

        customerName:
          customerName.trim(),

        customerEmail:
          customerEmail.trim().toLowerCase(),

        amount: numericAmount,

        method,

        details:
          details?.trim() || method,

        brand: finalBrand,

        status: paymentStatus,

        paymentDate:
          parsedDate,

        createdBy:
          req.admin?.id || null,
      });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    console.error(
      "CREATE PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating payment",
    });
  }
};

/* =====================================================
   GET ALL PAYMENTS
   SEARCH + FILTER + PAGINATION
===================================================== */

const getAllPayments = async (req, res) => {
  try {
    const {
      search = "",
      status = "All",
      method = "All",
      type = "All",
      page = 1,
      limit = 6,
      startDate,
      endDate,
    } = req.query;

    const pageNumber =
      Math.max(Number(page) || 1, 1);

    const limitNumber =
      Math.max(Number(limit) || 6, 1);

    const skip =
      (pageNumber - 1) * limitNumber;

    /* -----------------------------------------------
       QUERY
    ----------------------------------------------- */

    const query = {};

    /* -----------------------------------------------
       SEARCH
    ----------------------------------------------- */

    if (search.trim()) {
      const searchRegex =
        new RegExp(
          search.trim().replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          ),
          "i"
        );

      query.$or = [
        {
          transactionId:
            searchRegex,
        },
        {
          bookingId:
            searchRegex,
        },
        {
          customerName:
            searchRegex,
        },
        {
          customerEmail:
            searchRegex,
        },
      ];
    }

    /* -----------------------------------------------
       STATUS
    ----------------------------------------------- */

    if (
      status &&
      status !== "All"
    ) {
      query.status = status;
    }

    /* -----------------------------------------------
       METHOD / TYPE
    ----------------------------------------------- */

    if (
      method &&
      method !== "All"
    ) {
      query.method = method;
    }

    /*
      Your frontend currently treats "type" as the
      payment method, so support it the same way.
    */

    if (
      type &&
      type !== "All"
    ) {
      query.method = type;
    }

    /* -----------------------------------------------
       DATE FILTER
    ----------------------------------------------- */

    if (startDate || endDate) {
      query.paymentDate = {};

      if (startDate) {
        const start =
          new Date(startDate);

        if (!Number.isNaN(start.getTime())) {
          start.setHours(
            0,
            0,
            0,
            0
          );

          query.paymentDate.$gte =
            start;
        }
      }

      if (endDate) {
        const end =
          new Date(endDate);

        if (!Number.isNaN(end.getTime())) {
          end.setHours(
            23,
            59,
            59,
            999
          );

          query.paymentDate.$lte =
            end;
        }
      }
    }

    /* -----------------------------------------------
       DATABASE
    ----------------------------------------------- */

    const [
      payments,
      total,
    ] = await Promise.all([
      Payment.find(query)
        .sort({
          paymentDate: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Payment.countDocuments(query),
    ]);

    const totalPages =
      Math.ceil(
        total / limitNumber
      ) || 1;

    return res.status(200).json({
      success: true,

      payments,

      pagination: {
        currentPage:
          pageNumber,

        totalPages,

        totalItems:
          total,

        itemsPerPage:
          limitNumber,

        hasNextPage:
          pageNumber < totalPages,

        hasPreviousPage:
          pageNumber > 1,
      },
    });
  } catch (error) {
    console.error(
      "GET PAYMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch payments",
    });
  }
};

/* =====================================================
   GET SINGLE PAYMENT
===================================================== */

const getPaymentById = async (
  req,
  res
) => {
  try {
    const payment =
      await Payment.findById(
        req.params.id
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error(
      "GET PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch payment",
    });
  }
};

/* =====================================================
   UPDATE PAYMENT
===================================================== */

const updatePayment = async (
  req,
  res
) => {
  try {
    const {
      bookingId,
      customerName,
      customerEmail,
      amount,
      method,
      details,
      brand,
      status,
      paymentDate,
      date,
    } = req.body;

    const payment =
      await Payment.findById(
        req.params.id
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Payment not found",
      });
    }

    /* -----------------------------------------------
       UPDATE BASIC FIELDS
    ----------------------------------------------- */

    if (bookingId !== undefined) {
      payment.bookingId =
        bookingId
          .trim()
          .toUpperCase();
    }

    if (customerName !== undefined) {
      payment.customerName =
        customerName.trim();
    }

    if (customerEmail !== undefined) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          customerEmail.trim()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid customer email",
        });
      }

      payment.customerEmail =
        customerEmail
          .trim()
          .toLowerCase();
    }

    if (amount !== undefined) {
      const numericAmount =
        Number(amount);

      if (
        Number.isNaN(
          numericAmount
        ) ||
        numericAmount < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid amount",
        });
      }

      payment.amount =
        numericAmount;
    }

    if (method !== undefined) {
      const allowedMethods = [
        "UPI",
        "Credit Card",
        "Debit Card",
        "PayPal",
        "Net Banking",
        "Cash",
      ];

      if (
        !allowedMethods.includes(
          method
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment method",
        });
      }

      payment.method = method;

      if (!brand) {
        payment.brand =
          getPaymentBrand(
            method,
            details ??
              payment.details
          );
      }
    }

    if (details !== undefined) {
      payment.details =
        details.trim();
    }

    if (brand !== undefined) {
      payment.brand =
        brand;
    }

    if (status !== undefined) {
      const allowedStatuses = [
        "Successful",
        "Pending",
        "Failed",
        "Refunded",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment status",
        });
      }

      payment.status =
        status;
    }

    if (
      paymentDate !== undefined ||
      date !== undefined
    ) {
      const finalDate =
        paymentDate || date;

      const parsedDate =
        new Date(finalDate);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment date",
        });
      }

      payment.paymentDate =
        parsedDate;
    }

    await payment.save();

    return res.status(200).json({
      success: true,
      message:
        "Payment updated successfully",
      payment,
    });
  } catch (error) {
    console.error(
      "UPDATE PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update payment",
    });
  }
};

/* =====================================================
   DELETE PAYMENT
===================================================== */

const deletePayment = async (
  req,
  res
) => {
  try {
    const payment =
      await Payment.findById(
        req.params.id
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Payment not found",
      });
    }

    await payment.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Payment deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete payment",
    });
  }
};

/* =====================================================
   PAYMENT SUMMARY
===================================================== */

const getPaymentSummary = async (
  req,
  res
) => {
  try {
    const [
      totalTransactions,
      totalAmountResult,
      successfulResult,
      successfulAmountResult,
      refundedAmountResult,
      pendingResult,
      failedResult,
      refundedResult,
    ] = await Promise.all([
      Payment.countDocuments(),

      Payment.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      Payment.countDocuments({
        status: "Successful",
      }),

      Payment.aggregate([
        {
          $match: {
            status: "Successful",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      Payment.aggregate([
        {
          $match: {
            status: "Refunded",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      Payment.countDocuments({
        status: "Pending",
      }),

      Payment.countDocuments({
        status: "Failed",
      }),

      Payment.countDocuments({
        status: "Refunded",
      }),
    ]);

    return res.status(200).json({
      success: true,

      summary: {
        totalTransactions,

        totalAmount:
          totalAmountResult[0]
            ?.total || 0,

        successfulPayments:
          successfulResult,

        successfulAmount:
          successfulAmountResult[0]
            ?.total || 0,

        refundedAmount:
          refundedAmountResult[0]
            ?.total || 0,

        pendingPayments:
          pendingResult,

        failedPayments:
          failedResult,

        refundedPayments:
          refundedResult,
      },
    });
  } catch (error) {
    console.error(
      "PAYMENT SUMMARY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to get payment summary",
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentSummary,
};