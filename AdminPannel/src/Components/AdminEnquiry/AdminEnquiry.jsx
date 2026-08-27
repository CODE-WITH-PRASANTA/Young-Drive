import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import "./AdminEnquiry.css";

const AdminEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    date: "",
    message: "",
    status: "New",
  });

  // =====================================================
  // FETCH ENQUIRIES
  // =====================================================

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("FETCHING ENQUIRIES...");

      const response = await API.get("/enquiries");

      console.log("ENQUIRIES RESPONSE:", response.data);

      const enquiryData =
        response.data?.data ||
        response.data?.enquiries ||
        response.data ||
        [];

      if (!Array.isArray(enquiryData)) {
        setEnquiries([]);
        return;
      }

      setEnquiries(enquiryData);
    } catch (err) {
      console.error("FETCH ENQUIRIES ERROR:", err);
      console.error("SERVER RESPONSE:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          "Failed to load enquiries."
      );

      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // =====================================================
  // VIEW
  // =====================================================

  const handleView = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsViewModalOpen(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (enquiry) => {
    setSelectedEnquiry(enquiry);

    setEditData({
      name: enquiry.name || "",
      phone: enquiry.phone || "",
      email: enquiry.email || "",
      course: enquiry.course || "",
      date: enquiry.date || "",
      message: enquiry.message || "",
      status: enquiry.status || "New",
    });

    setIsEditModalOpen(true);
  };

  // =====================================================
  // EDIT CHANGE
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedEnquiry?._id) {
      return;
    }

    try {
      const response = await API.put(
        `/enquiries/${selectedEnquiry._id}`,
        editData
      );

      console.log("UPDATE ENQUIRY RESPONSE:", response.data);

      if (response.data?.success) {
        alert("Enquiry updated successfully.");

        setIsEditModalOpen(false);
        setSelectedEnquiry(null);

        fetchEnquiries();
      } else {
        alert(
          response.data?.message ||
            "Failed to update enquiry."
        );
      }
    } catch (err) {
      console.error("UPDATE ENQUIRY ERROR:", err);
      console.error("SERVER RESPONSE:", err?.response?.data);

      alert(
        err?.response?.data?.message ||
          "Failed to update enquiry."
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (enquiry) => {
    if (!enquiry?._id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the enquiry from ${enquiry.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await API.delete(
        `/enquiries/${enquiry._id}`
      );

      console.log("DELETE RESPONSE:", response.data);

      if (response.data?.success) {
        alert("Enquiry deleted successfully.");

        setEnquiries((prev) =>
          prev.filter(
            (item) =>
              String(item._id) !==
              String(enquiry._id)
          )
        );
      } else {
        alert(
          response.data?.message ||
            "Failed to delete enquiry."
        );
      }
    } catch (err) {
      console.error("DELETE ENQUIRY ERROR:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to delete enquiry."
      );
    }
  };

  // =====================================================
  // CLOSE VIEW
  // =====================================================

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedEnquiry(null);
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEnquiry(null);
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Contacted":
        return "status-contacted";

      case "Converted":
        return "status-converted";

      case "Closed":
        return "status-closed";

      default:
        return "status-new";
    }
  };

  return (
    <div className="admin-enquiry-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-enquiry-header">

        <div>
          <h1 className="admin-enquiry-title">
            Enquiries
          </h1>

          <p className="admin-enquiry-subtitle">
            Manage customer vehicle enquiries
          </p>
        </div>

        <div className="admin-enquiry-count">
          <span>Total Enquiries</span>
          <strong>{enquiries.length}</strong>
        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="admin-enquiry-error">
          {error}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div className="admin-enquiry-loading">
          <div className="admin-enquiry-loader"></div>
          <p>Loading enquiries...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="admin-enquiry-empty">
          <div className="admin-enquiry-empty-icon">
            ✉
          </div>

          <h3>No Enquiries Found</h3>

          <p>
            Customer enquiries will appear here.
          </p>
        </div>
      ) : (
        /* =================================================
           TABLE
        ================================================= */

        <div className="admin-enquiry-table-wrapper">

          <table className="admin-enquiry-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Vehicle</th>
                <th>Preferred Date</th>
                <th>Message</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {enquiries.map((enquiry, index) => (
                <tr key={enquiry._id || index}>

                  {/* NUMBER */}

                  <td>
                    <span className="enquiry-number">
                      {index + 1}
                    </span>
                  </td>

                  {/* CUSTOMER */}

                  <td>
                    <div className="customer-info">

                      <div className="customer-avatar">
                        {(enquiry.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <div className="customer-name">
                          {enquiry.name || "Unknown"}
                        </div>

                        <div className="customer-email">
                          {enquiry.email || "—"}
                        </div>
                      </div>

                    </div>
                  </td>

                  {/* CONTACT */}

                  <td>
                    <a
                      href={`tel:${enquiry.phone || ""}`}
                      className="enquiry-phone"
                    >
                      {enquiry.phone || "—"}
                    </a>
                  </td>

                  {/* VEHICLE */}

                  <td>
                    <span className="vehicle-badge">
                      🚗 {enquiry.course || "—"}
                    </span>
                  </td>

                  {/* DATE */}

                  <td>
                    <span className="enquiry-date">
                      {formatDate(enquiry.date)}
                    </span>
                  </td>

                  {/* MESSAGE */}

                  <td>
                    <div className="enquiry-message">
                      {enquiry.message
                        ? enquiry.message.length > 45
                          ? `${enquiry.message.substring(
                              0,
                              45
                            )}...`
                          : enquiry.message
                        : "No message"}
                    </div>
                  </td>

                  {/* STATUS */}

                  <td>
                    <span
                      className={`enquiry-status ${getStatusClass(
                        enquiry.status
                      )}`}
                    >
                      {enquiry.status || "New"}
                    </span>
                  </td>

                  {/* CREATED */}

                  <td>
                    <span className="created-date">
                      {formatDate(
                        enquiry.createdAt
                      )}
                    </span>
                  </td>

                  {/* ACTION */}

                  <td>

                    <div className="enquiry-actions">

                      <button
                        type="button"
                        className="enquiry-view-btn"
                        onClick={() =>
                          handleView(enquiry)
                        }
                        title="View"
                      >
                        👁
                      </button>

                      <button
                        type="button"
                        className="enquiry-edit-btn"
                        onClick={() =>
                          handleEdit(enquiry)
                        }
                        title="Edit"
                      >
                        ✏
                      </button>

                      <button
                        type="button"
                        className="enquiry-delete-btn"
                        onClick={() =>
                          handleDelete(enquiry)
                        }
                        title="Delete"
                      >
                        🗑
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {isViewModalOpen && selectedEnquiry && (
        <div
          className="admin-enquiry-modal-overlay"
          onClick={closeViewModal}
        >

          <div
            className="admin-enquiry-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-enquiry-modal-header">

              <div>
                <h2>Enquiry Details</h2>
                <p>
                  Customer enquiry information
                </p>
              </div>

              <button
                type="button"
                className="admin-enquiry-modal-close"
                onClick={closeViewModal}
              >
                ×
              </button>

            </div>

            <div className="admin-enquiry-modal-body">

              <div className="enquiry-detail-customer">

                <div className="large-customer-avatar">
                  {(selectedEnquiry.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h3>
                    {selectedEnquiry.name ||
                      "Unknown"}
                  </h3>

                  <p>
                    {selectedEnquiry.email ||
                      "No email"}
                  </p>
                </div>

              </div>

              <div className="enquiry-detail-grid">

                <div className="detail-box">
                  <span>Phone</span>
                  <strong>
                    {selectedEnquiry.phone ||
                      "—"}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Vehicle</span>
                  <strong>
                    {selectedEnquiry.course ||
                      "—"}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Preferred Date</span>
                  <strong>
                    {formatDate(
                      selectedEnquiry.date
                    )}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Status</span>
                  <strong>
                    {selectedEnquiry.status ||
                      "New"}
                  </strong>
                </div>

              </div>

              <div className="detail-message-box">

                <span>Customer Message</span>

                <p>
                  {selectedEnquiry.message ||
                    "No message provided."}
                </p>

              </div>

            </div>

            <div className="admin-enquiry-modal-footer">

              <button
                type="button"
                className="modal-secondary-btn"
                onClick={closeViewModal}
              >
                Close
              </button>

              <button
                type="button"
                className="modal-primary-btn"
                onClick={() => {
                  closeViewModal();
                  handleEdit(
                    selectedEnquiry
                  );
                }}
              >
                Edit Enquiry
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {isEditModalOpen && selectedEnquiry && (
        <div
          className="admin-enquiry-modal-overlay"
          onClick={closeEditModal}
        >

          <div
            className="admin-enquiry-modal edit-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-enquiry-modal-header">

              <div>
                <h2>Edit Enquiry</h2>
                <p>
                  Update customer enquiry
                </p>
              </div>

              <button
                type="button"
                className="admin-enquiry-modal-close"
                onClick={closeEditModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleUpdate}>

              <div className="admin-enquiry-modal-body">

                <div className="edit-form-grid">

                  <div className="edit-form-field">
                    <label>Name</label>

                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={
                        handleEditChange
                      }
                      required
                    />
                  </div>

                  <div className="edit-form-field">
                    <label>Phone</label>

                    <input
                      type="text"
                      name="phone"
                      value={editData.phone}
                      onChange={
                        handleEditChange
                      }
                      required
                    />
                  </div>

                  <div className="edit-form-field">
                    <label>Email</label>

                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={
                        handleEditChange
                      }
                      required
                    />
                  </div>

                  <div className="edit-form-field">
                    <label>Vehicle</label>

                    <input
                      type="text"
                      name="course"
                      value={editData.course}
                      onChange={
                        handleEditChange
                      }
                      required
                    />
                  </div>

                  <div className="edit-form-field">
                    <label>Preferred Date</label>

                    <input
                      type="date"
                      name="date"
                      value={editData.date}
                      onChange={
                        handleEditChange
                      }
                    />
                  </div>

                  <div className="edit-form-field">
                    <label>Status</label>

                    <select
                      name="status"
                      value={editData.status}
                      onChange={
                        handleEditChange
                      }
                    >
                      <option value="New">
                        New
                      </option>

                      <option value="Contacted">
                        Contacted
                      </option>

                      <option value="Converted">
                        Converted
                      </option>

                      <option value="Closed">
                        Closed
                      </option>
                    </select>
                  </div>

                </div>

                <div className="edit-form-field edit-message-field">
                  <label>Message</label>

                  <textarea
                    name="message"
                    rows="5"
                    value={editData.message}
                    onChange={
                      handleEditChange
                    }
                  ></textarea>
                </div>

              </div>

              <div className="admin-enquiry-modal-footer">

                <button
                  type="button"
                  className="modal-secondary-btn"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-primary-btn"
                >
                  Update Enquiry
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminEnquiry;