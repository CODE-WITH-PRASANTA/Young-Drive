import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";

import {
  FiCreditCard,
  FiDollarSign,
  FiCheckCircle,
  FiRotateCcw,
  FiClock,
  FiSearch,
  FiFilter,
  FiDownload,
  FiCalendar,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiX,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";

import * as XLSX from "xlsx";
import axios from "axios";

import "./Payments.css";

/* =====================================================
   API CONFIG
===================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const PAYMENT_API =
  `${API_BASE_URL}/payments`;

/* =====================================================
   DEFAULT FORM
===================================================== */

const defaultPaymentForm = {
  bookingId: "",
  customerName: "",
  customerEmail: "",
  amount: "",
  method: "UPI",
  details: "",
  status: "Successful",
  date: "",
};

/* =====================================================
   DEFAULT FILTER
===================================================== */

const defaultFilterValues = {
  type: "All",
  method: "All",
  status: "All",
};

/* =====================================================
   COMPONENT
===================================================== */

const Payments = () => {
  /* ===================================================
     STATE
  =================================================== */

  const [transactions, setTransactions] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState("All");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalEntries, setTotalEntries] =
    useState(0);

  const [dateRange, setDateRange] =
    useState(
      "01 May 2025 - 20 May 2025"
    );

  const [showCalendar, setShowCalendar] =
    useState(false);

  const [showFilterModal, setShowFilterModal] =
    useState(false);

  const [selectedTxn, setSelectedTxn] =
    useState(null);

  const [showAddPayment, setShowAddPayment] =
    useState(false);

  /* EDIT */
  const [showEditPayment, setShowEditPayment] =
    useState(false);

  const [editingPayment, setEditingPayment] =
    useState(null);

  /* DELETE */
  const [deletePayment, setDeletePayment] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [paymentForm, setPaymentForm] =
    useState(defaultPaymentForm);

  const [formMessage, setFormMessage] =
    useState("");

  const [filterValues, setFilterValues] =
    useState(defaultFilterValues);

  const [loading, setLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [summary, setSummary] =
    useState({
      totalTransactions: 0,
      totalAmount: 0,
      successfulPayments: 0,
      successfulAmount: 0,
      refundedAmount: 0,
      pendingPayments: 0,
      failedPayments: 0,
      refundedPayments: 0,
    });

  const calendarRef =
    useRef(null);

  const itemsPerPage = 6;

  /* ===================================================
     TOKEN
  =================================================== */

  const getToken = () => {
    return localStorage.getItem(
      "adminToken"
    );
  };

  /* ===================================================
     AUTH CONFIG
  =================================================== */

  const getAuthConfig = () => {
    const token = getToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  /* ===================================================
     AUTH ERROR
  =================================================== */

  const handleAuthError = (error) => {
    if (
      error?.response?.status === 401
    ) {
      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "adminAuth"
      );

      window.location.href =
        "/login";

      return true;
    }

    return false;
  };

  /* ===================================================
     CLOSE CALENDAR
  =================================================== */

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(
          event.target
        )
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* ===================================================
     FORM CHANGE
  =================================================== */

  const handlePaymentFormChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormMessage("");
  };

  /* ===================================================
     BRAND
  =================================================== */

  const getBrand = (
    method,
    details = ""
  ) => {
    const value =
      method?.toLowerCase() || "";

    const paymentDetails =
      details?.toLowerCase() || "";

    if (
      value === "credit card"
    ) {
      return "visa";
    }

    if (
      value === "debit card"
    ) {
      return "mastercard";
    }

    if (
      value === "paypal"
    ) {
      return "paypal";
    }

    if (
      value === "upi"
    ) {
      if (
        paymentDetails.includes(
          "google"
        ) ||
        paymentDetails.includes(
          "gpay"
        )
      ) {
        return "google";
      }

      if (
        paymentDetails.includes(
          "phone"
        ) ||
        paymentDetails.includes(
          "phonepe"
        )
      ) {
        return "phonepe";
      }

      return "upi";
    }

    if (
      value === "net banking"
    ) {
      return "bank";
    }

    if (
      value === "cash"
    ) {
      return "cash";
    }

    return "payment";
  };

  /* ===================================================
     FORMAT DATE
  =================================================== */

  const formatPaymentDate = (
    date
  ) => {
    if (!date) {
      return "";
    }

    const selectedDate =
      new Date(date);

    if (
      Number.isNaN(
        selectedDate.getTime()
      )
    ) {
      return date;
    }

    return selectedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* ===================================================
     FORMAT DATE INPUT
  =================================================== */

  const formatDateForInput = (
    date
  ) => {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    const year =
      parsedDate.getFullYear();

    const month =
      String(
        parsedDate.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        parsedDate.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* ===================================================
     MAP BACKEND PAYMENT
  =================================================== */

  const mapPayment = (
    payment
  ) => {
    return {
      ...payment,

      id:
        payment.transactionId ||
        payment.id ||
        payment._id,

      _id:
        payment._id ||
        payment.id,

      bookingId:
        payment.bookingId || "",

      customerName:
        payment.customerName || "",

      customerEmail:
        payment.customerEmail || "",

      amount:
        Number(
          payment.amount || 0
        ),

      method:
        payment.method || "UPI",

      details:
        payment.details ||
        payment.method ||
        "",

      brand:
        payment.brand ||
        getBrand(
          payment.method,
          payment.details
        ),

      status:
        payment.status ||
        "Pending",

      date:
        formatPaymentDate(
          payment.paymentDate ||
            payment.date
        ),

      rawDate:
        payment.paymentDate ||
        payment.date,
    };
  };

  /* ===================================================
     FETCH PAYMENTS
  =================================================== */

  const fetchPayments = async () => {
    const token = getToken();

    if (!token) {
      window.location.href =
        "/login";

      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (
        searchQuery.trim()
      ) {
        params.search =
          searchQuery.trim();
      }

      if (
        activeTab !== "All"
      ) {
        params.status =
          activeTab;
      } else if (
        filterValues.status !==
        "All"
      ) {
        params.status =
          filterValues.status;
      }

      if (
        filterValues.method !==
        "All"
      ) {
        params.method =
          filterValues.method;
      }

      if (
        filterValues.type !==
        "All"
      ) {
        params.type =
          filterValues.type;
      }

      const response =
        await axios.get(
          PAYMENT_API,
          {
            ...getAuthConfig(),
            params,
          }
        );

      const data =
        response.data;

      if (
        data?.success
      ) {
        const paymentList =
          Array.isArray(
            data.payments
          )
            ? data.payments
            : [];

        setTransactions(
          paymentList.map(
            mapPayment
          )
        );

        if (
          data.pagination
        ) {
          setTotalPages(
            data.pagination
              .totalPages || 1
          );

          setTotalEntries(
            data.pagination
              .totalItems || 0
          );
        } else {
          setTotalPages(1);

          setTotalEntries(
            paymentList.length
          );
        }
      } else {
        setTransactions([]);
        setTotalPages(1);
        setTotalEntries(0);

        setErrorMessage(
          data?.message ||
            "Unable to fetch payments"
        );
      }
    } catch (error) {
      console.error(
        "FETCH PAYMENTS ERROR:",
        error
      );

      if (
        handleAuthError(error)
      ) {
        return;
      }

      setErrorMessage(
        error?.response?.data
          ?.message ||
          "Unable to fetch payments"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================================================
     FETCH SUMMARY
  =================================================== */

  const fetchSummary = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const response =
        await axios.get(
          `${PAYMENT_API}/summary`,
          getAuthConfig()
        );

      if (
        response.data?.success
      ) {
        setSummary(
          response.data.summary ||
            {
              totalTransactions: 0,
              totalAmount: 0,
              successfulPayments: 0,
              successfulAmount: 0,
              refundedAmount: 0,
              pendingPayments: 0,
              failedPayments: 0,
              refundedPayments: 0,
            }
        );
      }
    } catch (error) {
      console.error(
        "FETCH SUMMARY ERROR:",
        error
      );

      handleAuthError(error);
    }
  };

  /* ===================================================
     REFRESH ALL
  =================================================== */

  const refreshPayments = async () => {
    await Promise.all([
      fetchPayments(),
      fetchSummary(),
    ]);
  };

  /* ===================================================
     INITIAL LOAD
  =================================================== */

  useEffect(() => {
    fetchSummary();
  }, []);

  /* ===================================================
     FETCH ON FILTER/PAGE
  =================================================== */

  useEffect(() => {
    fetchPayments();
  }, [
    currentPage,
    activeTab,
    filterValues,
  ]);

  /* ===================================================
     SEARCH
  =================================================== */

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setCurrentPage(1);
        fetchPayments();
      }, 400);

    return () =>
      clearTimeout(timer);
  }, [
    searchQuery,
  ]);

  /* ===================================================
     ADD PAYMENT
  =================================================== */

  const handleAddPayment = async (
    e
  ) => {
    e.preventDefault();

    if (
      !paymentForm.bookingId.trim() ||
      !paymentForm.customerName.trim() ||
      !paymentForm.customerEmail.trim() ||
      !paymentForm.amount ||
      !paymentForm.date
    ) {
      setFormMessage(
        "Please fill all required fields."
      );

      return;
    }

    if (
      Number(paymentForm.amount) < 0
    ) {
      setFormMessage(
        "Amount cannot be negative."
      );

      return;
    }

    try {
      setSubmitting(true);
      setFormMessage("");

      const payload = {
        bookingId:
          paymentForm.bookingId
            .trim()
            .toUpperCase(),

        customerName:
          paymentForm.customerName
            .trim(),

        customerEmail:
          paymentForm.customerEmail
            .trim()
            .toLowerCase(),

        amount:
          Number(
            paymentForm.amount
          ),

        method:
          paymentForm.method,

        details:
          paymentForm.details.trim() ||
          paymentForm.method,

        brand:
          getBrand(
            paymentForm.method,
            paymentForm.details
          ),

        status:
          paymentForm.status,

        paymentDate:
          paymentForm.date,
      };

      

      const response =
        await axios.post(
          PAYMENT_API,
          payload,
          getAuthConfig()
        );

      if (
        response.data?.success
      ) {
        setShowAddPayment(
          false
        );

        setPaymentForm(
          defaultPaymentForm
        );

        setFormMessage("");

        setCurrentPage(1);

        await fetchSummary();

        await fetchPayments();
      } else {
        setFormMessage(
          response.data?.message ||
            "Unable to add payment."
        );
      }
    } catch (error) {
      console.error(
        "ADD PAYMENT ERROR:",
        error
      );

      if (
        handleAuthError(error)
      ) {
        return;
      }

      setFormMessage(
        error?.response?.data
          ?.message ||
          "Unable to add payment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ===================================================
     OPEN EDIT
  =================================================== */

  const handleOpenEdit = (
    txn
  ) => {
    setEditingPayment(txn);

    setPaymentForm({
      bookingId:
        txn.bookingId || "",

      customerName:
        txn.customerName || "",

      customerEmail:
        txn.customerEmail || "",

      amount:
        txn.amount ?? "",

      method:
        txn.method || "UPI",

      details:
        txn.details || "",

      status:
        txn.status || "Pending",

      date:
        formatDateForInput(
          txn.rawDate
        ),
    });

    setFormMessage("");

    setShowEditPayment(
      true
    );

    setSelectedTxn(null);
  };

  /* ===================================================
     CLOSE EDIT
  =================================================== */

  const closeEditPayment = () => {
    if (submitting) {
      return;
    }

    setShowEditPayment(
      false
    );

    setEditingPayment(null);

    setPaymentForm(
      defaultPaymentForm
    );

    setFormMessage("");
  };

  /* ===================================================
     EDIT PAYMENT
  =================================================== */

  const handleEditPayment = async (
    e
  ) => {
    e.preventDefault();

    if (!editingPayment) {
      return;
    }

    if (
      !paymentForm.bookingId.trim() ||
      !paymentForm.customerName.trim() ||
      !paymentForm.customerEmail.trim() ||
      !paymentForm.amount ||
      !paymentForm.date
    ) {
      setFormMessage(
        "Please fill all required fields."
      );

      return;
    }

    if (
      Number(paymentForm.amount) < 0
    ) {
      setFormMessage(
        "Amount cannot be negative."
      );

      return;
    }

    const paymentId =
      editingPayment._id ||
      editingPayment.id;

    if (!paymentId) {
      setFormMessage(
        "Payment ID not found."
      );

      return;
    }

    try {
      setSubmitting(true);
      setFormMessage("");

      const payload = {
        bookingId:
          paymentForm.bookingId
            .trim()
            .toUpperCase(),

        customerName:
          paymentForm.customerName
            .trim(),

        customerEmail:
          paymentForm.customerEmail
            .trim()
            .toLowerCase(),

        amount:
          Number(
            paymentForm.amount
          ),

        method:
          paymentForm.method,

        details:
          paymentForm.details.trim() ||
          paymentForm.method,

        brand:
          getBrand(
            paymentForm.method,
            paymentForm.details
          ),

        status:
          paymentForm.status,

        paymentDate:
          paymentForm.date,
      };

     

      const response =
        await axios.put(
          `${PAYMENT_API}/${paymentId}`,
          payload,
          getAuthConfig()
        );

      if (
        response.data?.success
      ) {
        setShowEditPayment(
          false
        );

        setEditingPayment(null);

        setPaymentForm(
          defaultPaymentForm
        );

        setFormMessage("");

        await fetchPayments();
        await fetchSummary();
      } else {
        setFormMessage(
          response.data?.message ||
            "Unable to update payment."
        );
      }
    } catch (error) {
      console.error(
        "UPDATE PAYMENT ERROR:",
        error
      );

      if (
        handleAuthError(error)
      ) {
        return;
      }

      setFormMessage(
        error?.response?.data
          ?.message ||
          "Unable to update payment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ===================================================
     OPEN DELETE
  =================================================== */

  const handleOpenDelete = (
    txn
  ) => {
    setDeletePayment(txn);

    setShowDeleteModal(
      true
    );

    setSelectedTxn(null);
  };

  /* ===================================================
     CLOSE DELETE
  =================================================== */

  const closeDeleteModal = () => {
    if (deleting) {
      return;
    }

    setDeletePayment(null);

    setShowDeleteModal(
      false
    );
  };

  /* ===================================================
     DELETE PAYMENT
  =================================================== */

  const handleDeletePayment = async () => {
    if (!deletePayment) {
      return;
    }

    const paymentId =
      deletePayment._id ||
      deletePayment.id;

    if (!paymentId) {
      alert(
        "Payment ID not found."
      );

      return;
    }

    try {
      setDeleting(true);
      setErrorMessage("");

      

      const response =
        await axios.delete(
          `${PAYMENT_API}/${paymentId}`,
          getAuthConfig()
        );

      if (
        response.data?.success
      ) {
        setShowDeleteModal(
          false
        );

        setDeletePayment(
          null
        );

        /*
          If last item on a page
          was deleted, move to
          previous page.
        */

        if (
          transactions.length ===
            1 &&
          currentPage > 1
        ) {
          setCurrentPage(
            (prev) =>
              prev - 1
          );
        } else {
          await fetchPayments();
        }

        await fetchSummary();
      } else {
        setErrorMessage(
          response.data?.message ||
            "Unable to delete payment."
        );
      }
    } catch (error) {
      console.error(
        "DELETE PAYMENT ERROR:",
        error
      );

      if (
        handleAuthError(error)
      ) {
        return;
      }

      setErrorMessage(
        error?.response?.data
          ?.message ||
          "Unable to delete payment."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* ===================================================
     CLOSE ADD
  =================================================== */

  const closeAddPayment = () => {
    if (submitting) {
      return;
    }

    setShowAddPayment(
      false
    );

    setPaymentForm(
      defaultPaymentForm
    );

    setFormMessage("");
  };

  /* ===================================================
     RESET FILTERS
  =================================================== */

  const resetFilters = () => {
    setActiveTab("All");

    setSearchQuery("");

    setFilterValues(
      defaultFilterValues
    );

    setCurrentPage(1);

    setShowFilterModal(
      false
    );
  };

  /* ===================================================
     TAB CHANGE
  =================================================== */

  const handleTabChange = (
    tab
  ) => {
    setActiveTab(tab);

    setCurrentPage(1);

    setFilterValues(
      (prev) => ({
        ...prev,
        status: "All",
      })
    );
  };

  /* ===================================================
     EXPORT
  =================================================== */

  const handleExport = () => {
    if (
      !transactions.length
    ) {
      alert(
        "No payment data available to export."
      );

      return;
    }

    const exportData =
      transactions.map(
        (txn) => ({
          "Transaction ID":
            txn.id,

          "Booking ID":
            txn.bookingId,

          Customer:
            txn.customerName,

          Email:
            txn.customerEmail,

          Amount:
            txn.amount,

          "Payment Method":
            txn.method,

          Details:
            txn.details,

          Status:
            txn.status,

          "Payment Date":
            txn.date,
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Payments"
    );

    XLSX.writeFile(
      workbook,
      "payments_report.xlsx"
    );
  };

  /* ===================================================
     TABLE DATA
  =================================================== */

  const currentTableData =
    useMemo(() => {
      return transactions;
    }, [
      transactions,
    ]);

  /* ===================================================
     SUMMARY
  =================================================== */

  const totalAmount =
    Number(
      summary.totalAmount || 0
    );

  const successfulPayments =
    Number(
      summary.successfulPayments ||
        0
    );

  const refundedAmount =
    Number(
      summary.refundedAmount || 0
    );

  const pendingPayments =
    Number(
      summary.pendingPayments ||
        0
    );

  /* ===================================================
     PAGINATION
  =================================================== */

  const showingFrom =
    totalEntries === 0
      ? 0
      : (currentPage - 1) *
          itemsPerPage +
        1;

  const showingTo =
    Math.min(
      currentPage *
        itemsPerPage,
      totalEntries
    );

  /* ===================================================
     FORM UI
  =================================================== */

  const paymentFormFields = (
    <div className="payments-form-grid">

      <div className="payments-form-group">
        <label>
          Booking ID *
        </label>

        <input
          type="text"
          name="bookingId"
          placeholder="e.g. BK1259"
          value={
            paymentForm.bookingId
          }
          onChange={
            handlePaymentFormChange
          }
          required
        />
      </div>

      <div className="payments-form-group">
        <label>
          Customer Name *
        </label>

        <input
          type="text"
          name="customerName"
          placeholder="Enter customer name"
          value={
            paymentForm.customerName
          }
          onChange={
            handlePaymentFormChange
          }
          required
        />
      </div>

      <div className="payments-form-group">
        <label>
          Customer Email *
        </label>

        <input
          type="email"
          name="customerEmail"
          placeholder="customer@email.com"
          value={
            paymentForm.customerEmail
          }
          onChange={
            handlePaymentFormChange
          }
          required
        />
      </div>

      <div className="payments-form-group">
        <label>
          Amount *
        </label>

        <div className="payments-amount-input">

          <span>
            ₹
          </span>

          <input
            type="number"
            name="amount"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={
              paymentForm.amount
            }
            onChange={
              handlePaymentFormChange
            }
            required
          />

        </div>
      </div>

      <div className="payments-form-group">
        <label>
          Payment Method *
        </label>

        <select
          name="method"
          value={
            paymentForm.method
          }
          onChange={
            handlePaymentFormChange
          }
        >
          <option value="UPI">
            UPI
          </option>

          <option value="Credit Card">
            Credit Card
          </option>

          <option value="Debit Card">
            Debit Card
          </option>

          <option value="PayPal">
            PayPal
          </option>

          <option value="Net Banking">
            Net Banking
          </option>

          <option value="Cash">
            Cash
          </option>
        </select>
      </div>

      <div className="payments-form-group">
        <label>
          Payment Details
        </label>

        <input
          type="text"
          name="details"
          placeholder="e.g. Google Pay / •••• 4242"
          value={
            paymentForm.details
          }
          onChange={
            handlePaymentFormChange
          }
        />
      </div>

      <div className="payments-form-group">
        <label>
          Status *
        </label>

        <select
          name="status"
          value={
            paymentForm.status
          }
          onChange={
            handlePaymentFormChange
          }
        >
          <option value="Successful">
            Successful
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Failed">
            Failed
          </option>

          <option value="Refunded">
            Refunded
          </option>
        </select>
      </div>

      <div className="payments-form-group">
        <label>
          Payment Date *
        </label>

        <input
          type="date"
          name="date"
          value={
            paymentForm.date
          }
          onChange={
            handlePaymentFormChange
          }
          required
        />
      </div>

    </div>
  );

  /* ===================================================
     RETURN
  =================================================== */

  return (
    <div className="payments-container">

      {/* =============================================
          HEADER
      ============================================== */}

      <div className="payments-header-wrapper">

        <div className="payments-title-group">

          <h1 className="payments-title">
            Payments
          </h1>

          <p className="payments-subtitle">
            Manage all transactions and
            payments
          </p>

        </div>

        <div
          className="payments-header-actions"
          ref={calendarRef}
        >

          <div
            className="payments-date-picker"
            onClick={() =>
              setShowCalendar(
                !showCalendar
              )
            }
          >
            <FiCalendar className="payments-date-icon" />

            <span className="payments-date-display">
              {dateRange}
            </span>
          </div>

          {showCalendar && (
            <div className="payments-calendar-popup">

              <div className="payments-calendar-header">
                <span>
                  May 2025
                </span>
              </div>

              <div className="payments-calendar-grid">

                {[
                  "Su",
                  "Mo",
                  "Tu",
                  "We",
                  "Th",
                  "Fr",
                  "Sa",
                ].map((d) => (
                  <span
                    key={d}
                    className="payments-cal-day-name"
                  >
                    {d}
                  </span>
                ))}

                {[
                  ...Array(31),
                ].map((_, i) => {

                  const day =
                    i + 1;

                  const isSelected =
                    day >= 1 &&
                    day <= 20;

                  return (
                    <button
                      key={day}
                      type="button"
                      className={`payments-cal-day ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {
                        setDateRange(
                          `${
                            day < 10
                              ? "0" +
                                day
                              : day
                          } May 2025 - 20 May 2025`
                        );

                        setShowCalendar(
                          false
                        );
                      }}
                    >
                      {day}
                    </button>
                  );
                })}

              </div>
            </div>
          )}

          <button
            type="button"
            className="payments-add-btn"
            onClick={() => {
              setPaymentForm(
                defaultPaymentForm
              );

              setFormMessage("");

              setShowAddPayment(
                true
              );
            }}
          >
            <FiPlus />
            Add Payment
          </button>

          <button
            type="button"
            className="payments-export-btn"
            onClick={handleExport}
          >
            <FiDownload />
            Export Excel
          </button>

        </div>
      </div>

      {/* =============================================
          ERROR
      ============================================== */}

      {errorMessage && (
        <div className="payments-form-message">
          {errorMessage}
        </div>
      )}

      {/* =============================================
          STATS
      ============================================== */}

      <div className="payments-stats-grid">

        <div className="payments-stat-card">

          <div className="payments-stat-content">

            <span className="payments-stat-label">
              Total Transactions
            </span>

            <h2 className="payments-stat-value">
              {
                summary.totalTransactions ||
                0
              }
            </h2>

          </div>

          <div className="payments-stat-icon-box payments-purple">
            <FiCreditCard />
          </div>

        </div>

        <div className="payments-stat-card">

          <div className="payments-stat-content">

            <span className="payments-stat-label">
              Total Amount
            </span>

            <h2 className="payments-stat-value">
              ₹{" "}
              {totalAmount.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </h2>

          </div>

          <div className="payments-stat-icon-box payments-green">
            <FiDollarSign />
          </div>

        </div>

        <div className="payments-stat-card">

          <div className="payments-stat-content">

            <span className="payments-stat-label">
              Successful Payments
            </span>

            <h2 className="payments-stat-value">
              {successfulPayments}
            </h2>

          </div>

          <div className="payments-stat-icon-box payments-green">
            <FiCheckCircle />
          </div>

        </div>

        <div className="payments-stat-card">

          <div className="payments-stat-content">

            <span className="payments-stat-label">
              Refunds
            </span>

            <h2 className="payments-stat-value">
              ₹{" "}
              {refundedAmount.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </h2>

          </div>

          <div className="payments-stat-icon-box payments-pink">
            <FiRotateCcw />
          </div>

        </div>

        <div className="payments-stat-card">

          <div className="payments-stat-content">

            <span className="payments-stat-label">
              Pending Payments
            </span>

            <h2 className="payments-stat-value">
              {pendingPayments}
            </h2>

          </div>

          <div className="payments-stat-icon-box payments-yellow">
            <FiClock />
          </div>

        </div>

      </div>

      {/* =============================================
          CONTROLS
      ============================================== */}

      <div className="payments-controls-bar">

        <div className="payments-tabs">

          {[
            "All",
            "Successful",
            "Pending",
            "Failed",
            "Refunded",
          ].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`payments-tab-btn ${
                activeTab === tab
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleTabChange(
                  tab
                )
              }
            >
              {tab}
            </button>
          ))}

        </div>

        <div className="payments-filter-search-group">

          <div className="payments-search-box">

            <FiSearch className="payments-search-icon" />

            <input
              type="text"
              placeholder="Search by transaction ID, customer, booking ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(
                  e.target.value
                );

                setCurrentPage(1);
              }}
              className="payments-search-input"
            />

          </div>

          <button
            type="button"
            className={`payments-filter-btn ${
              showFilterModal
                ? "active"
                : ""
            }`}
            onClick={() =>
              setShowFilterModal(
                !showFilterModal
              )
            }
          >
            <FiFilter />
            Filters
          </button>

        </div>

      </div>

      {/* =============================================
          FILTER
      ============================================== */}

      {showFilterModal && (
        <div className="payments-filter-dropdown">

          <div className="payments-filter-header">

            <div>

              <h3>
                Payment Filters
              </h3>

              <span>
                Filter transactions
              </span>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilterModal(
                  false
                )
              }
              className="payments-filter-close"
            >
              <FiX />
            </button>

          </div>

          <div className="payments-filter-form">

            <div className="payments-filter-field">

              <label>
                Payment Type
              </label>

              <select
                value={
                  filterValues.type
                }
                onChange={(e) => {
                  setFilterValues(
                    (prev) => ({
                      ...prev,
                      type:
                        e.target.value,
                    })
                  );

                  setCurrentPage(1);
                }}
              >
                <option value="All">
                  All Types
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Credit Card">
                  Credit Card
                </option>

                <option value="Debit Card">
                  Debit Card
                </option>

                <option value="PayPal">
                  PayPal
                </option>

                <option value="Net Banking">
                  Net Banking
                </option>

                <option value="Cash">
                  Cash
                </option>
              </select>

            </div>

            <div className="payments-filter-field">

              <label>
                Payment Method
              </label>

              <select
                value={
                  filterValues.method
                }
                onChange={(e) => {
                  setFilterValues(
                    (prev) => ({
                      ...prev,
                      method:
                        e.target.value,
                    })
                  );

                  setCurrentPage(1);
                }}
              >
                <option value="All">
                  All Methods
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Credit Card">
                  Credit Card
                </option>

                <option value="Debit Card">
                  Debit Card
                </option>

                <option value="PayPal">
                  PayPal
                </option>

                <option value="Net Banking">
                  Net Banking
                </option>

                <option value="Cash">
                  Cash
                </option>
              </select>

            </div>

            <div className="payments-filter-field">

              <label>
                Payment Status
              </label>

              <select
                value={
                  filterValues.status
                }
                onChange={(e) => {
                  setFilterValues(
                    (prev) => ({
                      ...prev,
                      status:
                        e.target.value,
                    })
                  );

                  setActiveTab(
                    "All"
                  );

                  setCurrentPage(1);
                }}
              >
                <option value="All">
                  All Status
                </option>

                <option value="Successful">
                  Successful
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Failed">
                  Failed
                </option>

                <option value="Refunded">
                  Refunded
                </option>
              </select>

            </div>

          </div>

          <button
            type="button"
            className="payments-reset-filter-btn"
            onClick={
              resetFilters
            }
          >
            Reset All Filters
          </button>

        </div>
      )}

      {/* =============================================
          TABLE
      ============================================== */}

      <div className="payments-table-container">

        <table className="payments-table">

          <thead>

            <tr>

              <th>
                Transaction ID
              </th>

              <th>
                Booking ID
              </th>

              <th>
                Customer
              </th>

              <th>
                Amount
              </th>

              <th>
                Payment Method
              </th>

              <th>
                Status
              </th>

              <th>
                Payment Date
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="8"
                  className="payments-no-data"
                >
                  Loading payments...
                </td>

              </tr>

            ) : currentTableData.length >
              0 ? (

              currentTableData.map(
                (txn) => (

                  <tr
                    key={
                      txn._id ||
                      txn.id
                    }
                  >

                    <td className="payments-txn-id">
                      {txn.id}
                    </td>

                    <td className="payments-booking-id">
                      {txn.bookingId}
                    </td>

                    <td>

                      <div className="payments-customer-info">

                        <span className="payments-customer-name">
                          {
                            txn.customerName
                          }
                        </span>

                        <span className="payments-customer-email">
                          {
                            txn.customerEmail
                          }
                        </span>

                      </div>

                    </td>

                    <td className="payments-amount">
                      ₹{" "}
                      {Number(
                        txn.amount
                      ).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </td>

                    <td>

                      <div className="payments-method-info">

                        <span
                          className={`payments-brand-badge ${txn.brand}`}
                        >
                          {txn.brand?.toUpperCase()}
                        </span>

                        <div className="payments-method-text">

                          <span className="payments-method-name">
                            {
                              txn.method
                            }
                          </span>

                          <span className="payments-method-details">
                            {
                              txn.details
                            }
                          </span>

                        </div>

                      </div>

                    </td>

                    <td>

                      <span
                        className={`payments-status-badge ${txn.status
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )}`}
                      >
                        {
                          txn.status
                        }
                      </span>

                    </td>

                    <td className="payments-date">
                      {txn.date}
                    </td>

                    <td>

                      <div
                        className="payments-action-buttons"
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "8px",
                        }}
                      >

                        {/* VIEW */}

                        <button
                          type="button"
                          className="payments-action-view-btn"
                          onClick={() =>
                            setSelectedTxn(
                              txn
                            )
                          }
                        >
                          <FiEye />
                          View
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          className="payments-action-edit-btn"
                          onClick={() =>
                            handleOpenEdit(
                              txn
                            )
                          }
                          title="Edit Payment"
                        >
                          <FiEdit />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className="payments-action-delete-btn"
                          onClick={() =>
                            handleOpenDelete(
                              txn
                            )
                          }
                          title="Delete Payment"
                        >
                          <FiTrash2 />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="8"
                  className="payments-no-data"
                >
                  No transactions
                  found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* =============================================
          PAGINATION
      ============================================== */}

      <div className="payments-pagination-footer">

        <div className="payments-pagination-info">

          Showing{" "}
          {showingFrom}
          {" "}to{" "}
          {showingTo}
          {" "}of{" "}
          {totalEntries}
          {" "}entries

        </div>

        <div className="payments-pagination-controls">

          <button
            type="button"
            className="payments-page-nav-btn"
            onClick={() =>
              setCurrentPage(
                (prev) =>
                  Math.max(
                    prev - 1,
                    1
                  )
              )
            }
            disabled={
              currentPage === 1
            }
          >
            <FiChevronLeft />
          </button>

          {[
            ...Array(totalPages),
          ].map((_, index) => {

            const pageNum =
              index + 1;

            if (
              pageNum === 1 ||
              pageNum ===
                totalPages ||
              (
                pageNum >=
                  currentPage - 1 &&
                pageNum <=
                  currentPage + 1
              )
            ) {
              return (
                <button
                  type="button"
                  key={pageNum}
                  className={`payments-page-number-btn ${
                    currentPage ===
                    pageNum
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentPage(
                      pageNum
                    )
                  }
                >
                  {pageNum}
                </button>
              );
            }

            if (
              pageNum ===
                currentPage - 2 ||
              pageNum ===
                currentPage + 2
            ) {
              return (
                <span
                  key={pageNum}
                  className="payments-page-dots"
                >
                  ...
                </span>
              );
            }

            return null;
          })}

          <button
            type="button"
            className="payments-page-nav-btn"
            onClick={() =>
              setCurrentPage(
                (prev) =>
                  Math.min(
                    prev + 1,
                    totalPages
                  )
              )
            }
            disabled={
              currentPage ===
              totalPages
            }
          >
            <FiChevronRight />
          </button>

        </div>

      </div>

      {/* =============================================
          ADD PAYMENT MODAL
      ============================================== */}

      {showAddPayment && (

        <div
          className="payments-modal-overlay payments-add-payment-overlay"
          onClick={
            closeAddPayment
          }
        >

          <div
            className="payments-modal-content payments-add-payment-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="payments-add-payment-header">

              <div>

                <h3>
                  Add Payment
                </h3>

                <p>
                  Create a new payment
                  transaction
                </p>

              </div>

              <button
                type="button"
                className="payments-modal-x"
                onClick={
                  closeAddPayment
                }
              >
                <FiX />
              </button>

            </div>

            {formMessage && (
              <div className="payments-form-message">
                {formMessage}
              </div>
            )}

            <form
              className="payments-add-payment-form"
              onSubmit={
                handleAddPayment
              }
            >

              {paymentFormFields}

              <div className="payments-add-payment-actions">

                <button
                  type="button"
                  className="payments-cancel-btn"
                  onClick={
                    closeAddPayment
                  }
                  disabled={
                    submitting
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="payments-save-btn"
                  disabled={
                    submitting
                  }
                >
                  <FiCheckCircle />

                  {submitting
                    ? "Saving..."
                    : "Add Payment"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =============================================
          EDIT PAYMENT MODAL
      ============================================== */}

      {showEditPayment && (

        <div
          className="payments-modal-overlay payments-add-payment-overlay"
          onClick={
            closeEditPayment
          }
        >

          <div
            className="payments-modal-content payments-add-payment-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="payments-add-payment-header">

              <div>

                <h3>
                  Edit Payment
                </h3>

                <p>
                  Update payment
                  transaction
                </p>

              </div>

              <button
                type="button"
                className="payments-modal-x"
                onClick={
                  closeEditPayment
                }
                disabled={
                  submitting
                }
              >
                <FiX />
              </button>

            </div>

            {formMessage && (
              <div className="payments-form-message">
                {formMessage}
              </div>
            )}

            <form
              className="payments-add-payment-form"
              onSubmit={
                handleEditPayment
              }
            >

              {paymentFormFields}

              <div className="payments-add-payment-actions">

                <button
                  type="button"
                  className="payments-cancel-btn"
                  onClick={
                    closeEditPayment
                  }
                  disabled={
                    submitting
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="payments-save-btn"
                  disabled={
                    submitting
                  }
                >
                  <FiEdit />

                  {submitting
                    ? "Updating..."
                    : "Update Payment"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =============================================
          VIEW PAYMENT
      ============================================== */}

      {selectedTxn && (

        <div
          className="payments-modal-overlay"
          onClick={() =>
            setSelectedTxn(null)
          }
        >

          <div
            className="payments-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3>
              Transaction Details
            </h3>

            <div className="payments-modal-body">

              <p>
                <strong>
                  Transaction ID:
                </strong>{" "}
                {selectedTxn.id}
              </p>

              <p>
                <strong>
                  Booking ID:
                </strong>{" "}
                {
                  selectedTxn.bookingId
                }
              </p>

              <p>
                <strong>
                  Customer:
                </strong>{" "}
                {
                  selectedTxn.customerName
                }{" "}
                (
                {
                  selectedTxn.customerEmail
                }
                )
              </p>

              <p>
                <strong>
                  Amount:
                </strong>{" "}
                ₹{" "}
                {Number(
                  selectedTxn.amount
                ).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </p>

              <p>
                <strong>
                  Payment Method:
                </strong>{" "}
                {
                  selectedTxn.method
                }{" "}
                (
                {
                  selectedTxn.details
                }
                )
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {
                  selectedTxn.status
                }
              </p>

              <p>
                <strong>
                  Date:
                </strong>{" "}
                {
                  selectedTxn.date
                }
              </p>

            </div>

            <div
              style={{
                display:
                  "flex",
                gap: "10px",
                marginTop:
                  "20px",
              }}
            >

              <button
                type="button"
                className="payments-modal-close-btn"
                onClick={() =>
                  handleOpenEdit(
                    selectedTxn
                  )
                }
              >
                <FiEdit />
                Edit
              </button>

              <button
                type="button"
                className="payments-modal-close-btn"
                onClick={() =>
                  handleOpenDelete(
                    selectedTxn
                  )
                }
              >
                <FiTrash2 />
                Delete
              </button>

              <button
                type="button"
                className="payments-modal-close-btn"
                onClick={() =>
                  setSelectedTxn(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =============================================
          DELETE CONFIRMATION
      ============================================== */}

      {showDeleteModal &&
        deletePayment && (

          <div
            className="payments-modal-overlay"
            onClick={
              closeDeleteModal
            }
          >

            <div
              className="payments-modal-content"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div
                style={{
                  textAlign:
                    "center",
                }}
              >

                <div
                  style={{
                    width:
                      "55px",
                    height:
                      "55px",
                    borderRadius:
                      "50%",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    margin:
                      "0 auto 15px",
                    background:
                      "#fee2e2",
                    color:
                      "#dc2626",
                  }}
                >
                  <FiTrash2
                    size={24}
                  />
                </div>

                <h3>
                  Delete Payment?
                </h3>

                <p>
                  Are you sure you want
                  to delete this payment?
                </p>

                <p>
                  <strong>
                    {
                      deletePayment.id
                    }
                  </strong>
                </p>

              </div>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "flex-end",
                  gap: "10px",
                  marginTop:
                    "25px",
                }}
              >

                <button
                  type="button"
                  className="payments-cancel-btn"
                  onClick={
                    closeDeleteModal
                  }
                  disabled={
                    deleting
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="payments-save-btn"
                  onClick={
                    handleDeletePayment
                  }
                  disabled={
                    deleting
                  }
                  style={{
                    background:
                      "#dc2626",
                  }}
                >

                  <FiTrash2 />

                  {deleting
                    ? "Deleting..."
                    : "Delete"}

                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default Payments;