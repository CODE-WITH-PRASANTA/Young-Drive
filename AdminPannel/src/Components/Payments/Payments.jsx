import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";

import * as XLSX from "xlsx";
import "./Payments.css";
import API from "../../api/axios";

const Payments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const [activeTab, setActiveTab] = useState("All");

  // =====================================================
  // DATE RANGE
  // =====================================================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [fromDate, setFromDate] = useState("2025-05-01");
  const [toDate, setToDate] = useState("2026-12-31");

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  // =====================================================
  // SEARCH
  // =====================================================

  const [searchTerm, setSearchTerm] = useState("");

  // =====================================================
  // PAYMENT DATA
  // =====================================================

  const [payments, setPayments] = useState([]);

  // =====================================================
  // FORM DATA
  // =====================================================

  const emptyForm = {
    companyName: "YOUNG DRIVES",
    bookingId: "",
    customerName: "",
    customerEmail: "",
    amount: "",
    paymentMethod: "UPI",
    paymentDetails: "",
    status: "Successful",
    paymentDate: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // =====================================================
  // FETCH PAYMENTS
  // =====================================================

  const fetchPayments = async () => {
    try {
      const response = await API.get("/payments");

      if (response.data?.success) {
        setPayments(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load payment records."
      );
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // DATE PICKER - OPEN
  // =====================================================

  const openDatePicker = (ref) => {
    if (!ref.current) return;

    try {
      ref.current.showPicker();
    } catch (error) {
      ref.current.focus();
    }
  };

  // =====================================================
  // FROM DATE CHANGE
  // =====================================================

  const handleFromDateChange = (e) => {
    const selectedDate = e.target.value;

    setFromDate(selectedDate);

    // If From Date becomes greater than To Date,
    // automatically move To Date to the same date.
    if (toDate && selectedDate > toDate) {
      setToDate(selectedDate);
    }
  };

  // =====================================================
  // TO DATE CHANGE
  // =====================================================

  const handleToDateChange = (e) => {
    const selectedDate = e.target.value;

    // Don't allow To Date before From Date
    if (fromDate && selectedDate < fromDate) {
      setToDate(fromDate);
      return;
    }

    setToDate(selectedDate);
  };

  // =====================================================
  // TODAY
  // =====================================================

  const handleToday = () => {
    const today = getTodayDate();

    setFromDate(today);
    setToDate(today);
  };

  // =====================================================
  // CLEAR DATE FILTER
  // =====================================================

  const handleClearDates = () => {
    setFromDate("");
    setToDate("");
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setCurrentEditId(null);

    setFormData({
      ...emptyForm,
    });

    setIsModalOpen(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEditPayment = (payment) => {
    setIsEditMode(true);
    setCurrentEditId(payment.transactionId);

    setFormData({
      companyName:
        payment.companyName || "YOUNG DRIVES",

      bookingId: payment.bookingId || "",

      customerName: payment.customerName || "",

      customerEmail: payment.customerEmail || "",

      amount: payment.amount ?? "",

      paymentMethod:
        payment.paymentMethod || "UPI",

      paymentDetails:
        payment.paymentDetails || "",

      status:
        payment.status || "Successful",

      paymentDate:
        payment.paymentDate || "",
    });

    setIsModalOpen(true);
  };

  // =====================================================
  // DELETE PAYMENT
  // =====================================================

  const handleDeletePayment = async (transactionId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this payment record?"
      )
    ) {
      return;
    }

    try {
      const response = await API.delete(
        `/payments/${transactionId}`
      );

      if (response.data?.success) {
        setPayments((prev) =>
          prev.filter(
            (payment) =>
              payment.transactionId !== transactionId
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete payment:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete payment record."
      );
    }
  };

  // =====================================================
  // ADD / UPDATE PAYMENT
  // =====================================================

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (isEditMode) {
        const response = await API.put(
          `/payments/${currentEditId}`,
          payload
        );

        if (response.data?.success) {
          setPayments((prev) =>
            prev.map((payment) =>
              payment.transactionId === currentEditId
                ? response.data.data
                : payment
            )
          );
        }
      } else {
        const response = await API.post(
          "/payments",
          payload
        );

        if (response.data?.success) {
          setPayments((prev) => [
            response.data.data,
            ...prev,
          ]);
        }
      }

      setFormData({
        ...emptyForm,
      });

      setIsEditMode(false);
      setCurrentEditId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        "Error saving payment:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save payment record."
      );
    }
  };

  // =====================================================
  // FILTER PAYMENTS
  // =====================================================

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // STATUS
      const statusMatch =
        activeTab === "All" ||
        payment.status === activeTab;

      // SEARCH
      const search =
        searchTerm.trim().toLowerCase();

      const searchMatch =
        !search ||
        payment.transactionId
          ?.toLowerCase()
          .includes(search) ||
        payment.bookingId
          ?.toLowerCase()
          .includes(search) ||
        payment.customerName
          ?.toLowerCase()
          .includes(search) ||
        payment.customerEmail
          ?.toLowerCase()
          .includes(search);

      // DATE
      const paymentDate =
        payment.paymentDate || "";

      const fromMatch =
        !fromDate ||
        paymentDate >= fromDate;

      const toMatch =
        !toDate ||
        paymentDate <= toDate;

      return (
        statusMatch &&
        searchMatch &&
        fromMatch &&
        toMatch
      );
    });
  }, [
    payments,
    activeTab,
    searchTerm,
    fromDate,
    toDate,
  ]);

  // =====================================================
  // METRICS
  // =====================================================

  const totalTransactions =
    filteredPayments.length;

  const totalAmount =
    filteredPayments.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  const successfulPayments =
    filteredPayments.filter(
      (payment) =>
        payment.status === "Successful"
    ).length;

  const refundAmount =
    filteredPayments
      .filter(
        (payment) =>
          payment.status === "Refunded"
      )
      .reduce(
        (total, payment) =>
          total + Number(payment.amount || 0),
        0
      );

  const pendingPayments =
    filteredPayments.filter(
      (payment) =>
        payment.status === "Pending"
    ).length;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    const d = new Date(`${date}T00:00:00`);

    if (Number.isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // EXPORT EXCEL
  // =====================================================

  const handleExportExcel = () => {
    if (filteredPayments.length === 0) {
      alert(
        "No payment records available for the selected filters."
      );
      return;
    }

    const excelData = filteredPayments.map(
      (payment, index) => ({
        "S.No": index + 1,

        "Transaction ID":
          payment.transactionId || "",

        "Booking ID":
          payment.bookingId || "",

        "Company Name":
          payment.companyName || "",

        "Customer Name":
          payment.customerName || "",

        "Customer Email":
          payment.customerEmail || "",

        Amount:
          Number(payment.amount || 0),

        "Payment Method":
          payment.paymentMethod || "",

        "Payment Details":
          payment.paymentDetails || "",

        Status:
          payment.status || "",

        "Payment Date":
          formatDate(payment.paymentDate),
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 22 },
      { wch: 30 },
      { wch: 15 },
      { wch: 18 },
      { wch: 25 },
      { wch: 15 },
      { wch: 18 },
    ];

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Payments"
    );

    const fileName =
      `Young_Drives_Payments_` +
      `${fromDate || "All"}` +
      `_to_` +
      `${toDate || "All"}.xlsx`;

    XLSX.writeFile(
      workbook,
      fileName
    );
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Successful":
        return "payments-status-successful";

      case "Pending":
        return "payments-status-pending";

      case "Failed":
        return "payments-status-failed";

      case "Refunded":
        return "payments-status-refunded";

      default:
        return "";
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="payments-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="payments-header-section">

        <div className="payments-title-wrapper">

          <h1 className="payments-main-title">
            Payments
          </h1>

          <p className="payments-subtitle">
            Manage all transactions and payments
          </p>

        </div>

        <div className="payments-header-actions">

          {/* =================================================
              DATE RANGE
          ================================================= */}

          <div className="payments-date-picker-badge">

            {/* CALENDAR BUTTON */}

            <button
              type="button"
              className="payments-calendar-button"
              onClick={() =>
                openDatePicker(fromDateRef)
              }
              title="Select date range"
            >
              📅
            </button>

            {/* FROM DATE */}

            <div className="payments-date-field">

              <span className="payments-date-label">
                From
              </span>

              <input
                ref={fromDateRef}
                type="date"
                value={fromDate}
                onChange={handleFromDateChange}
                className="payments-date-input"
                aria-label="From date"
              />

            </div>

            <span className="payments-date-separator">
              →
            </span>

            {/* TO DATE */}

            <div className="payments-date-field">

              <span className="payments-date-label">
                To
              </span>

              <input
                ref={toDateRef}
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={handleToDateChange}
                className="payments-date-input"
                aria-label="To date"
              />

            </div>

            {/* TODAY */}

            <button
              type="button"
              className="payments-date-action"
              onClick={handleToday}
              title="Set date range to today"
            >
              Today
            </button>

            {/* CLEAR */}

            {(fromDate || toDate) && (
              <button
                type="button"
                className="payments-date-clear"
                onClick={handleClearDates}
                title="Clear date filter"
              >
                ✕
              </button>
            )}

          </div>

          {/* ADD PAYMENT */}

          <button
            className="payments-btn payments-btn-primary"
            onClick={handleOpenAddModal}
          >
            <span>+</span>
            Add Payment
          </button>

          {/* EXPORT */}

          <button
            className="payments-btn payments-btn-outline"
            onClick={handleExportExcel}
          >
            <span>⬇</span>
            Export Excel
          </button>

        </div>
      </div>

      {/* =================================================
          METRICS
      ================================================= */}

      <div className="payments-metrics-grid">

        <div className="payments-metric-card">

          <div>
            <span className="payments-metric-label">
              Total Transactions
            </span>

            <h3 className="payments-metric-value">
              {totalTransactions}
            </h3>
          </div>

          <div className="payments-metric-icon-box payments-bg-purple">
            💳
          </div>

        </div>

        <div className="payments-metric-card">

          <div>
            <span className="payments-metric-label">
              Total Amount
            </span>

            <h3 className="payments-metric-value">
              ₹{" "}
              {totalAmount.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </h3>
          </div>

          <div className="payments-metric-icon-box payments-bg-green">
            ₹
          </div>

        </div>

        <div className="payments-metric-card">

          <div>
            <span className="payments-metric-label">
              Successful Payments
            </span>

            <h3 className="payments-metric-value">
              {successfulPayments}
            </h3>
          </div>

          <div className="payments-metric-icon-box payments-bg-light-green">
            ✔
          </div>

        </div>

        <div className="payments-metric-card">

          <div>
            <span className="payments-metric-label">
              Refunds
            </span>

            <h3 className="payments-metric-value">
              ₹{" "}
              {refundAmount.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </h3>
          </div>

          <div className="payments-metric-icon-box payments-bg-pink">
            🔄
          </div>

        </div>

        <div className="payments-metric-card">

          <div>
            <span className="payments-metric-label">
              Pending Payments
            </span>

            <h3 className="payments-metric-value">
              {pendingPayments}
            </h3>
          </div>

          <div className="payments-metric-icon-box payments-bg-yellow">
            ⏰
          </div>

        </div>

      </div>

      {/* =================================================
          FILTER BAR
      ================================================= */}

      <div className="payments-filter-toolbar">

        <div className="payments-tabs-group">

          {[
            "All",
            "Successful",
            "Pending",
            "Failed",
            "Refunded",
          ].map((tab) => (
            <button
              key={tab}
              className={`payments-tab-item ${
                activeTab === tab
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(tab)
              }
            >
              {tab}
            </button>
          ))}

        </div>

        <div className="payments-search-filter-group">

          <div className="payments-search-box">

            <span className="payments-search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by transaction ID, customer, booking ID..."
              className="payments-search-input"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="payments-table-container">

        <div className="payments-table-responsive">

          <table className="payments-data-table">

            <thead>

              <tr>
                <th>TRANSACTION ID</th>
                <th>BOOKING ID</th>
                <th>CUSTOMER</th>
                <th>AMOUNT</th>
                <th>PAYMENT METHOD</th>
                <th>STATUS</th>
                <th>PAYMENT DATE</th>
                <th className="payments-th-actions">
                  ACTIONS
                </th>
              </tr>

            </thead>

            <tbody>

              {filteredPayments.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="payments-empty-row"
                  >
                    No transactions found for the
                    selected filters.
                  </td>

                </tr>

              ) : (

                filteredPayments.map((payment) => (

                  <tr
                    key={payment.transactionId}
                  >

                    <td>
                      <strong>
                        {payment.transactionId}
                      </strong>
                    </td>

                    <td>
                      {payment.bookingId}
                    </td>

                    <td>

                      <div className="payments-customer-cell">

                        <strong>
                          {payment.customerName}
                        </strong>

                        <span>
                          {payment.customerEmail}
                        </span>

                      </div>

                    </td>

                    <td>

                      <strong>
                        ₹{" "}
                        {Number(
                          payment.amount || 0
                        ).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </strong>

                    </td>

                    <td>
                      {payment.paymentMethod}
                    </td>

                    <td>

                      <span
                        className={`payments-status-badge ${getStatusClass(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>

                    </td>

                    <td>
                      {formatDate(
                        payment.paymentDate
                      )}
                    </td>

                    <td className="payments-actions-cell">

                      <div className="payments-action-buttons">

                        <button
                          className="payments-action-btn payments-edit-btn"
                          onClick={() =>
                            handleEditPayment(
                              payment
                            )
                          }
                          title="Edit Payment"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="payments-action-btn payments-delete-btn"
                          onClick={() =>
                            handleDeletePayment(
                              payment.transactionId
                            )
                          }
                          title="Delete Record"
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="payments-table-footer">

          <span className="payments-pagination-info">
            Showing {filteredPayments.length} of{" "}
            {payments.length} entries
          </span>

          <div className="payments-pagination-controls">

            <button
              className="payments-page-btn"
              disabled
            >
              &lt;
            </button>

            <button className="payments-page-btn active">
              1
            </button>

            <button
              className="payments-page-btn"
              disabled
            >
              &gt;
            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {isModalOpen && (

        <div
          className="payments-modal-overlay"
          onClick={() =>
            setIsModalOpen(false)
          }
        >

          <div
            className="payments-modal-dialog"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="payments-modal-header">

              <div>

                <h2 className="payments-modal-title">
                  {isEditMode
                    ? "Edit Payment"
                    : "Add Payment"}
                </h2>

                <p className="payments-modal-subtitle">
                  {isEditMode
                    ? "Update existing payment transaction details"
                    : "Create a new payment transaction"}
                </p>

              </div>

              <button
                className="payments-modal-close-btn"
                onClick={() =>
                  setIsModalOpen(false)
                }
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleFormSubmit}
              className="payments-modal-form"
            >

              <div className="payments-form-grid">

                <div className="payments-form-group">

                  <label className="payments-form-label">
                    Company Name *
                  </label>

                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="payments-form-control"
                    required
                  />

                </div>

                <div className="payments-form-group">

                  <label className="payments-form-label">
                    Booking ID *
                  </label>

                  <input
                    type="text"
                    name="bookingId"
                    placeholder="e.g. BK1259"
                    value={formData.bookingId}
                    onChange={handleInputChange}
                    className="payments-form-control"
                    required
                  />

                </div>

                <div className="payments-form-group">

                  <label className="payments-form-label">
                    Customer Name *
                  </label>

                  <input
                    type="text"
                    name="customerName"
                    placeholder="Enter customer name"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="payments-form-control"
                    required
                  />

                </div>

                <div className="payments-form-group">

                  <label className="payments-form-label">
                    Customer Email *
                  </label>

                  <input
                    type="email"
                    name="customerEmail"
                    placeholder="customer@email.com"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="payments-form-control"
                    required
                  />

                </div>

                <div className="payments-form-group">

                  <label className="payments-form-label">
                    Amount *
                  </label>

                  <div className="payments-input-group-prefix">

                    <span className="payments-prefix-symbol">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="amount"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="payments-form-control payments-with-prefix"
                      required
                    />

                  </div>

                </div>

                <div className="payments-form-group">

                  <label className="payments-form-label">
                    Payment Method *
                  </label>

                  <select
                    name="paymentMethod"
                    value={
                      formData.paymentMethod
                    }
                    onChange={
                      handleInputChange
                    }
                    className="payments-form-control payments-select"
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

                    <option value="Net Banking">
                      Net Banking
                    </option>

                    <option value="Cash">
                      Cash
                    </option>

                  </select>

                </div>

                <div className="payments-form-group">

                  <label className="payments-form-label">
                    Payment Details
                  </label>

                  <input
                    type="text"
                    name="paymentDetails"
                    placeholder="e.g. Google Pay / UPI ID / Card"
                    value={
                      formData.paymentDetails
                    }
                    onChange={
                      handleInputChange
                    }
                    className="payments-form-control"
                  />

                </div>

                <div className="payments-form-group">

                  <label className="payments-form-label">
                    Status *
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={
                      handleInputChange
                    }
                    className="payments-form-control payments-select"
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

                <div className="payments-form-group payments-form-full">

                  <label className="payments-form-label">
                    Payment Date *
                  </label>

                  <input
                    type="date"
                    name="paymentDate"
                    value={
                      formData.paymentDate
                    }
                    onChange={
                      handleInputChange
                    }
                    className="payments-form-control"
                    required
                  />

                </div>

              </div>

              <div className="payments-modal-footer">

                <button
                  type="button"
                  className="payments-btn payments-btn-light"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="payments-btn payments-btn-primary"
                >
                  ✓{" "}
                  {isEditMode
                    ? "Save Changes"
                    : "Add Payment"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Payments;