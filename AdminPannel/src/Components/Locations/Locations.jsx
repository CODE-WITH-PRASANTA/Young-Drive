import React, { useState, useEffect, useMemo } from "react";

import {
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
  FiGrid,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiSave,
  FiX,
  FiInfo,
} from "react-icons/fi";

import "./Locations.css";

import API from "../../api/axios";


const Locations = () => {

  /* =====================================================
     STATE
  ===================================================== */

  const [locationsData, setLocationsData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState("All Status");

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isFormVisible, setIsFormVisible] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);

  const [editingId, setEditingId] = useState(null);


  /* =====================================================
     COUNTRY / STATE OPTIONS
  ===================================================== */

  const countries = [
    "India",
    "United States",
    "Canada",
    "United Kingdom",
  ];

  const states = [
    "Odisha",
    "Maharashtra",
    "West Bengal",
    "Delhi",
    "Karnataka",
    "Tamil Nadu",
    "Telangana",
    "Andhra Pradesh",
    "Gujarat",
    "Rajasthan",
    "Uttar Pradesh",
    "Bihar",
    "Jharkhand",
    "Kerala",
    "Madhya Pradesh",
    "Punjab",
    "Haryana",
  ];


  /* =====================================================
     INITIAL FORM
  ===================================================== */

  const initialFormState = {
    name: "",
    address: "",
    city: "",
    state: "Odisha",
    country: "India",
    postalCode: "",
    type: "Pickup & Drop",
    status: "Active",
    mapLink: "",
  };


  const [formData, setFormData] = useState(initialFormState);


  /* =====================================================
     FETCH ALL LOCATIONS
  ===================================================== */

  const fetchLocations = async () => {

    try {

      setLoading(true);

      const response = await API.get("/locations");

      console.log("Locations API Response:", response.data);

      if (response.data?.success) {

        setLocationsData(
          Array.isArray(response.data.data)
            ? response.data.data
            : []
        );

      } else {

        setLocationsData([]);

      }

    } catch (error) {

      console.error(
        "Error fetching locations:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      setLocationsData([]);

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     INITIAL API CALL
  ===================================================== */

  useEffect(() => {

    fetchLocations();

  }, []);


  /* =====================================================
     FILTER + SEARCH
  ===================================================== */

  const filteredLocations = useMemo(() => {

    return locationsData.filter((loc) => {

      const name =
        loc?.name?.toLowerCase() || "";

      const city =
        loc?.city?.toLowerCase() || "";

      const state =
        loc?.state?.toLowerCase() || "";

      const search =
        searchQuery.toLowerCase();

      const matchesSearch =
        name.includes(search) ||
        city.includes(search) ||
        state.includes(search);


      const matchesStatus =
        statusFilter === "All Status" ||
        loc.status === statusFilter;


      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    locationsData,
    searchQuery,
    statusFilter,
  ]);


  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages =
    Math.ceil(
      filteredLocations.length /
        itemsPerPage
    ) || 1;


  const currentTableData = useMemo(() => {

    const start =
      (currentPage - 1) *
      itemsPerPage;

    return filteredLocations.slice(
      start,
      start + itemsPerPage
    );

  }, [
    filteredLocations,
    currentPage,
    itemsPerPage,
  ]);


  /* =====================================================
     RESET FORM
  ===================================================== */

  const resetForm = () => {

    setFormData({
      ...initialFormState,
    });

    setEditingId(null);

  };


  /* =====================================================
     DELETE LOCATION
  ===================================================== */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Are you sure you want to delete this location?"
      )
    ) {
      return;
    }


    try {

      const response =
        await API.delete(
          `/locations/${id}`
        );


      if (response.data?.success) {

        setLocationsData((prev) =>
          prev.filter(
            (item) =>
              item._id !== id
          )
        );


        if (editingId === id) {

          resetForm();

        }

      } else {

        alert(
          response.data?.message ||
            "Failed to delete location"
        );

      }

    } catch (error) {

      console.error(
        "Error deleting location:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete location"
      );

    }

  };


  /* =====================================================
     EDIT LOCATION
  ===================================================== */

  const handleEdit = (loc) => {

    setFormData({

      name: loc?.name || "",

      address:
        loc?.address || "",

      city:
        loc?.city || "",

      state:
        loc?.state || "Odisha",

      country:
        loc?.country || "India",

      postalCode:
        loc?.postalCode || "",

      type:
        loc?.type ||
        "Pickup & Drop",

      status:
        loc?.status ||
        "Active",

      mapLink:
        loc?.mapLink || "",

    });


    setEditingId(loc._id);

    setIsFormVisible(true);

  };


  /* =====================================================
     HANDLE FORM CHANGE
  ===================================================== */

  const handleInputChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  /* =====================================================
     SUBMIT FORM
  ===================================================== */

  const handleFormSubmit = async (e) => {

    e.preventDefault();


    try {

      let response;


      /* =========================
         UPDATE
      ========================= */

      if (editingId) {

        response =
          await API.put(
            `/locations/${editingId}`,
            formData
          );

      }

      /* =========================
         CREATE
      ========================= */

      else {

        response =
          await API.post(
            "/locations",
            formData
          );

      }


      console.log(
        "Save Location Response:",
        response.data
      );


      if (response.data?.success) {

        if (editingId) {

          setLocationsData(
            (prev) =>
              prev.map((item) =>
                item._id === editingId
                  ? response.data.data
                  : item
              )
          );

        } else {

          setLocationsData(
            (prev) => [
              response.data.data,
              ...prev,
            ]
          );

        }


        resetForm();

        setShowAddModal(false);

      } else {

        alert(
          response.data?.message ||
            "Failed to save location"
        );

      }

    } catch (error) {

      console.error(
        "Error saving location:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to save location"
      );

    }

  };


  /* =====================================================
     RETURN
  ===================================================== */

  return (

    <div className="locations-container">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="locations-header-wrapper">

        <div className="locations-title-group">

          <h1 className="locations-title">
            Locations
          </h1>

          <p className="locations-subtitle">
            Manage all pickup and drop-off locations
          </p>

        </div>


        <div className="locations-header-right">

          <span className="locations-breadcrumb">
            Master Data &gt; Locations
          </span>

        </div>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="locations-stats-grid">


        <div className="locations-stat-card">

          <div>

            <span className="locations-stat-label">
              Total Locations
            </span>

            <h2 className="locations-stat-value">
              {locationsData.length}
            </h2>

            <span className="locations-stat-sub">
              All Locations
            </span>

          </div>


          <div className="locations-stat-icon-box locations-pink">

            <FiMapPin />

          </div>

        </div>



        <div className="locations-stat-card">

          <div>

            <span className="locations-stat-label">
              Active Locations
            </span>

            <h2 className="locations-stat-value">
              {
                locationsData.filter(
                  (l) =>
                    l.status === "Active"
                ).length
              }
            </h2>

            <span className="locations-stat-sub">
              Currently Active
            </span>

          </div>


          <div className="locations-stat-icon-box locations-green">

            <FiCheckCircle />

          </div>

        </div>



        <div className="locations-stat-card">

          <div>

            <span className="locations-stat-label">
              Inactive Locations
            </span>

            <h2 className="locations-stat-value">

              {
                locationsData.filter(
                  (l) =>
                    l.status === "Inactive"
                ).length
              }

            </h2>

            <span className="locations-stat-sub">
              Currently Inactive
            </span>

          </div>


          <div className="locations-stat-icon-box locations-orange">

            <FiAlertCircle />

          </div>

        </div>



        <div className="locations-stat-card">

          <div>

            <span className="locations-stat-label">
              Cities Covered
            </span>

            <h2 className="locations-stat-value">

              {
                new Set(
                  locationsData
                    .map(
                      (l) =>
                        l.city
                    )
                    .filter(Boolean)
                ).size
              }

            </h2>

            <span className="locations-stat-sub">
              Across All Locations
            </span>

          </div>


          <div className="locations-stat-icon-box locations-purple">

            <FiGrid />

          </div>

        </div>


      </div>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        className={`locations-main-layout ${
          !isFormVisible
            ? "form-collapsed"
            : ""
        }`}
      >


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="locations-left-content">


          {/* CONTROLS */}

          <div className="locations-controls-bar">


            <div className="locations-search-box">

              <FiSearch className="locations-search-icon" />

              <input
                type="text"
                placeholder="Search by location name or city..."
                value={searchQuery}
                onChange={(e) => {

                  setSearchQuery(
                    e.target.value
                  );

                  setCurrentPage(1);

                }}
                className="locations-search-input"
              />

            </div>


            <div className="locations-filter-dropdown-wrapper">

              <select
                value={statusFilter}
                onChange={(e) => {

                  setStatusFilter(
                    e.target.value
                  );

                  setCurrentPage(1);

                }}
                className="locations-status-select"
              >

                <option value="All Status">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>


          </div>


          {/* TABLE */}

          <div className="locations-table-container">

            <table className="locations-table">

              <thead>

                <tr>

                  <th>
                    <input type="checkbox" />
                  </th>

                  <th>
                    LOCATION NAME
                  </th>

                  <th>
                    CITY
                  </th>

                  <th>
                    STATE
                  </th>

                  <th>
                    TYPE
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>


              <tbody>


                {loading ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="locations-no-data"
                    >
                      Loading locations...
                    </td>

                  </tr>

                ) : currentTableData.length > 0 ? (

                  currentTableData.map(
                    (loc) => (

                      <tr key={loc._id}>


                        <td>

                          <input type="checkbox" />

                        </td>


                        <td>

                          <div className="locations-name-cell">

                            <FiMapPin className="locations-row-pin" />

                            <div>

                              <span className="locations-name-text">
                                {loc.name}
                              </span>

                              <span className="locations-address-sub">
                                {loc.address}
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>
                          {loc.city}
                        </td>


                        <td>
                          {loc.state}
                        </td>


                        <td>

                          <span
                            className={`locations-type-badge ${
                              loc.type
                                ? loc.type
                                    .toLowerCase()
                                    .replace(
                                      / & /g,
                                      "-"
                                    )
                                    .replace(
                                      / /g,
                                      "-"
                                    )
                                : ""
                            }`}
                          >
                            {loc.type}
                          </span>

                        </td>


                        <td>

                          <span
                            className={`locations-status-badge ${
                              loc.status
                                ? loc.status.toLowerCase()
                                : ""
                            }`}
                          >
                            {loc.status}
                          </span>

                        </td>


                        <td>

                          <div className="locations-action-btns">


                            <button
                              className="locations-action-edit"
                              onClick={() =>
                                handleEdit(loc)
                              }
                              title="Edit"
                            >

                              <FiEdit2 />

                            </button>


                            <button
                              className="locations-action-delete"
                              onClick={() =>
                                handleDelete(
                                  loc._id
                                )
                              }
                              title="Delete"
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
                      colSpan="7"
                      className="locations-no-data"
                    >
                      No locations found.
                    </td>

                  </tr>

                )}


              </tbody>

            </table>

          </div>


          {/* =================================================
              PAGINATION
          ================================================= */}

          <div className="locations-pagination-footer">


            <div className="locations-pagination-info">

              Showing{" "}

              {filteredLocations.length === 0
                ? 0
                : (currentPage - 1) *
                    itemsPerPage +
                  1}

              {" "}to{" "}

              {Math.min(
                currentPage *
                  itemsPerPage,
                filteredLocations.length
              )}

              {" "}of{" "}

              {filteredLocations.length}

              {" "}entries

            </div>


            <div className="locations-pagination-controls">


              <button
                className="locations-page-nav"
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


              {[...Array(totalPages)].map(
                (_, i) => (

                  <button
                    key={i + 1}
                    className={`locations-page-num ${
                      currentPage ===
                      i + 1
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setCurrentPage(
                        i + 1
                      )
                    }
                  >

                    {i + 1}

                  </button>

                )
              )}


              <button
                className="locations-page-nav"
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


              <select
                className="locations-per-page-select"
                value={`${itemsPerPage} / page`}
                onChange={(e) => {

                  setItemsPerPage(
                    Number(
                      e.target.value.split(
                        " "
                      )[0]
                    )
                  );

                  setCurrentPage(1);

                }}
              >

                <option value="5 / page">
                  5 / page
                </option>

                <option value="10 / page">
                  10 / page
                </option>

                <option value="20 / page">
                  20 / page
                </option>

              </select>


            </div>

          </div>


        </div>


        {/* =================================================
            RIGHT FORM
        ================================================= */}

        {isFormVisible && (

          <div className="locations-right-form-panel">


            <div className="locations-form-header">

              <div className="locations-form-title-wrap">

                <FiMapPin className="locations-form-header-icon" />

                <h3>
                  {editingId
                    ? "Edit Location"
                    : "Add New Location"}
                </h3>

              </div>


              <button
                className="locations-form-collapse-btn"
                onClick={() =>
                  setIsFormVisible(false)
                }
              >

                <FiChevronUp />

              </button>

            </div>


            <form
              onSubmit={handleFormSubmit}
              className="locations-form-body"
            >


              {/* LOCATION NAME */}

              <div className="locations-form-group">

                <label>
                  Location Name *
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter location name"
                  value={formData.name}
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>


              {/* ADDRESS */}

              <div className="locations-form-group">

                <label>
                  Address *
                </label>

                <input
                  type="text"
                  name="address"
                  placeholder="Enter complete address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>


              {/* CITY + STATE */}

              <div className="locations-form-row">


                <div className="locations-form-group">

                  <label>
                    City *
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={
                      handleInputChange
                    }
                    required
                  />

                </div>


                <div className="locations-form-group">

                  <label>
                    State *
                  </label>

                  <select
                    name="state"
                    value={formData.state}
                    onChange={
                      handleInputChange
                    }
                    required
                  >

                    <option value="">
                      Select state
                    </option>

                    {states.map(
                      (state) => (

                        <option
                          key={state}
                          value={state}
                        >
                          {state}
                        </option>

                      )
                    )}

                  </select>

                </div>


              </div>


              {/* COUNTRY + POSTAL */}

              <div className="locations-form-row">


                <div className="locations-form-group">

                  <label>
                    Country *
                  </label>

                  <select
                    name="country"
                    value={formData.country}
                    onChange={
                      handleInputChange
                    }
                    required
                  >

                    <option value="">
                      Select country
                    </option>

                    {countries.map(
                      (country) => (

                        <option
                          key={country}
                          value={country}
                        >
                          {country}
                        </option>

                      )
                    )}

                  </select>

                </div>


                <div className="locations-form-group">

                  <label>
                    Postal Code
                  </label>

                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Enter postal code"
                    value={
                      formData.postalCode
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                </div>


              </div>


              {/* LOCATION TYPE */}

              <div className="locations-form-group">

                <label>
                  Location Type *
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={
                    handleInputChange
                  }
                >

                  <option value="Pickup & Drop">
                    Pickup & Drop
                  </option>

                  <option value="Pickup Only">
                    Pickup Only
                  </option>

                  <option value="Drop Only">
                    Drop Only
                  </option>

                </select>

              </div>


              {/* GOOGLE MAP */}

              <div className="locations-form-group">

                <label>
                  Google Map Link
                </label>

                <input
                  type="text"
                  name="mapLink"
                  placeholder="https://maps.google.com/..."
                  value={formData.mapLink}
                  onChange={
                    handleInputChange
                  }
                />

              </div>


              {/* STATUS */}

              <div className="locations-form-group">

                <label>
                  Status *
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={
                    handleInputChange
                  }
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>


              {/* BUTTONS */}

              <div className="locations-form-buttons">

                <button
                  type="button"
                  className="locations-btn-cancel"
                  onClick={resetForm}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="locations-btn-save"
                >

                  <FiSave />

                  {editingId
                    ? "Update Location"
                    : "Save Location"}

                </button>

              </div>


            </form>


          </div>

        )}


      </div>


      {/* =================================================
          TIPS
      ================================================= */}

      <div className="locations-tips-banner">

        <div className="locations-tips-header">

          <FiInfo className="locations-tips-icon" />

          <strong>
            Location Management Tips
          </strong>

        </div>


        <ul>

          <li>
            Add all your pickup and drop-off
            locations for better service management.
          </li>

          <li>
            Inactive locations will not be
            shown in the booking form.
          </li>

          <li>
            Make sure the address is accurate
            for smooth navigation.
          </li>

        </ul>

      </div>


      {/* =================================================
          ADD LOCATION MODAL
      ================================================= */}

      {showAddModal && (

        <div
          className="locations-modal-overlay"
          onClick={() =>
            setShowAddModal(false)
          }
        >

          <div
            className="locations-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            <div className="locations-modal-header">

              <h3>
                Add New Location
              </h3>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
              >

                <FiX />

              </button>

            </div>


            <form
              onSubmit={handleFormSubmit}
              className="locations-modal-form"
            >


              <input
                type="text"
                name="name"
                placeholder="Location Name *"
                required
                value={formData.name}
                onChange={
                  handleInputChange
                }
              />


              <input
                type="text"
                name="address"
                placeholder="Address *"
                required
                value={formData.address}
                onChange={
                  handleInputChange
                }
              />


              <input
                type="text"
                name="city"
                placeholder="City *"
                required
                value={formData.city}
                onChange={
                  handleInputChange
                }
              />


              {/* STATE */}

              <select
                name="state"
                value={formData.state}
                onChange={
                  handleInputChange
                }
                required
              >

                <option value="">
                  Select State *
                </option>

                {states.map(
                  (state) => (

                    <option
                      key={state}
                      value={state}
                    >
                      {state}
                    </option>

                  )
                )}

              </select>


              {/* COUNTRY */}

              <select
                name="country"
                value={formData.country}
                onChange={
                  handleInputChange
                }
                required
              >

                <option value="">
                  Select Country *
                </option>

                {countries.map(
                  (country) => (

                    <option
                      key={country}
                      value={country}
                    >
                      {country}
                    </option>

                  )
                )}

              </select>


              {/* TYPE */}

              <select
                name="type"
                value={formData.type}
                onChange={
                  handleInputChange
                }
              >

                <option value="Pickup & Drop">
                  Pickup & Drop
                </option>

                <option value="Pickup Only">
                  Pickup Only
                </option>

                <option value="Drop Only">
                  Drop Only
                </option>

              </select>


              {/* MODAL ACTIONS */}

              <div className="locations-modal-actions">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="locations-save-modal-btn"
                >
                  Save Location
                </button>

              </div>


            </form>


          </div>

        </div>

      )}


    </div>

  );

};


export default Locations;