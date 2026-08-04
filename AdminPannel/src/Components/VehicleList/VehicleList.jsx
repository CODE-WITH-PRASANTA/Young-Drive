import React, { useState, useEffect, useMemo, useCallback } from "react";
import API from "../../api/axios";

// Feather Icons
import {
  FiSearch,
  FiFilter,
  FiRotateCcw,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiCheckCircle,
  FiClock,
  FiTool,
  FiArchive,
} from "react-icons/fi";

// Font Awesome Icons
import { FaCar } from "react-icons/fa";

import "./VehicleList.css";

const VehicleList = () => {
  // Main Data States
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  // Filter Input States
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("All Brands");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [fuelFilter, setFuelFilter] = useState("All");

  // Active Applied Filters State
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    brand: "All Brands",
    type: "All Types",
    status: "All Status",
    fuel: "All",
  });

  // Modal States
  const [viewModalVehicle, setViewModalVehicle] = useState(null);
  const [editModalVehicle, setEditModalVehicle] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. Fetch Vehicles from Express API Endpoint
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/vehicles");
      if (response.data.success) {
        setVehicles(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to fetch vehicles from backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Extract unique brands dynamically from database for filter dropdown
  const uniqueBrands = useMemo(() => {
    const brands = new Set(
      vehicles.map((v) => v.vehicleBrand).filter(Boolean)
    );
    return ["All Brands", ...Array.from(brands)];
  }, [vehicles]);

  // Extract unique vehicle types dynamically from database for filter dropdown
  const uniqueTypes = useMemo(() => {
    const types = new Set(
      vehicles.map((v) => v.vehicleType).filter(Boolean)
    );
    return ["All Types", ...Array.from(types)];
  }, [vehicles]);

  // Reset page to 1 whenever any filter changes so users don't get stuck on empty pages
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, brandFilter, typeFilter, statusFilter, fuelFilter]);

  // Filter Button Actions
  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchTerm,
      brand: brandFilter,
      type: typeFilter,
      status: statusFilter,
      fuel: fuelFilter,
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setBrandFilter("All Brands");
    setTypeFilter("All Types");
    setStatusFilter("All Status");
    setFuelFilter("All");
    setAppliedFilters({
      search: "",
      brand: "All Brands",
      type: "All Types",
      status: "All Status",
      fuel: "All",
    });
    setCurrentPage(1);
  };

  // Real-time Dynamic Filter Calculation
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((item) => {
      const brand = item.vehicleBrand || "";
      const model = item.vehicleModel || "";
      const variant = item.variantLine || "";
      const name = `${brand} ${model} ${variant}`.toLowerCase();
      const plate = (item.registrationNumber || "").toLowerCase();
      const query = searchTerm.trim().toLowerCase();

      // 1. Search Query Match
      const matchesSearch = !query || name.includes(query) || plate.includes(query);

      // 2. Brand Match
      const matchesBrand =
        brandFilter === "All Brands" ||
        brand.toLowerCase() === brandFilter.toLowerCase();

      // 3. Category/Type Match
      const matchesType =
        typeFilter === "All Types" ||
        (item.vehicleType || "").toLowerCase() === typeFilter.toLowerCase();

      // 4. Availability Status Match
      const matchesStatus =
        statusFilter === "All Status" ||
        (item.availabilityStatus || "").toLowerCase() === statusFilter.toLowerCase();

      // 5. Fuel Type Match
      const matchesFuel =
        fuelFilter === "All" ||
        (item.fuelType || "").toLowerCase() === fuelFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesBrand &&
        matchesType &&
        matchesStatus &&
        matchesFuel
      );
    });
  }, [vehicles, searchTerm, brandFilter, typeFilter, statusFilter, fuelFilter]);

  // Pagination Computations
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Checkbox Select Logic
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVehicles(currentData.map((v) => v._id));
    } else {
      setSelectedVehicles([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedVehicles((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete Vehicle Endpoint Integration
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        const res = await API.delete(`/vehicles/${id}`);
        if (res.data.success) {
          setVehicles((prev) => prev.filter((item) => item._id !== id));
          setSelectedVehicles((prev) => prev.filter((item) => item !== id));
          alert("Vehicle deleted successfully.");
        }
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete vehicle.");
      }
    }
  };

  // CSV Export Action
  const handleExport = () => {
    const dataToExport = selectedVehicles.length
      ? vehicles.filter((v) => selectedVehicles.includes(v._id))
      : filteredVehicles;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Brand,Model,Variant,Plate,Type,Status,DailyRent,SecurityDeposit"]
        .concat(
          dataToExport.map(
            (v) =>
              `"${v.vehicleBrand}","${v.vehicleModel}","${v.variantLine}","${v.registrationNumber}","${v.vehicleType}","${v.availabilityStatus}","${v.dailyRentPrice}","${v.securityDeposit}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vehicle_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Edit Submit API Integration
  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/vehicles/${editModalVehicle._id}`, editModalVehicle);
      if (res.data.success) {
        setVehicles((prev) =>
          prev.map((v) => (v._id === editModalVehicle._id ? res.data.data : v))
        );
        setEditModalVehicle(null);
        alert("Vehicle details updated successfully!");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update vehicle details.");
    }
  };

  // Date Formatting Helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="VehicleList">
      {/* Top Header */}
      <div className="VehicleList__header">
        <div>
          <h1 className="VehicleList__title">
            Vehicle List <FaCar className="VehicleList__title-icon" />
          </h1>
          <div className="VehicleList__breadcrumb">
            Dashboard &gt; Vehicles &gt; <span>Vehicle List</span>
          </div>
        </div>
        <div className="VehicleList__header-actions">
          <button className="VehicleList__btn-export" onClick={handleExport}>
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="VehicleList__stats">
        <div className="VehicleList__stat-card">
          <div className="VehicleList__stat-icon VehicleList__stat-icon--blue">
            <FaCar />
          </div>
          <div>
            <div className="VehicleList__stat-label">Total Vehicles</div>
            <div className="VehicleList__stat-value">{vehicles.length}</div>
            <div className="VehicleList__stat-sub">All Fleet Vehicles</div>
          </div>
        </div>

        <div className="VehicleList__stat-card">
          <div className="VehicleList__stat-icon VehicleList__stat-icon--green">
            <FiCheckCircle />
          </div>
          <div>
            <div className="VehicleList__stat-label">Available</div>
            <div className="VehicleList__stat-value">
              {vehicles.filter((v) => v.availabilityStatus === "Available").length}
            </div>
            <div className="VehicleList__stat-sub">Ready to Rent</div>
          </div>
        </div>

        <div className="VehicleList__stat-card">
          <div className="VehicleList__stat-icon VehicleList__stat-icon--yellow">
            <FiClock />
          </div>
          <div>
            <div className="VehicleList__stat-label">Unavailable</div>
            <div className="VehicleList__stat-value">
              {vehicles.filter((v) => v.availabilityStatus === "Unavailable").length}
            </div>
            <div className="VehicleList__stat-sub">Not Available</div>
          </div>
        </div>

        <div className="VehicleList__stat-card">
          <div className="VehicleList__stat-icon VehicleList__stat-icon--red">
            <FiTool />
          </div>
          <div>
            <div className="VehicleList__stat-label">Maintenance</div>
            <div className="VehicleList__stat-value">
              {vehicles.filter((v) => v.availabilityStatus === "Maintenance").length}
            </div>
            <div className="VehicleList__stat-sub">Under Service</div>
          </div>
        </div>

        <div className="VehicleList__stat-card">
          <div className="VehicleList__stat-icon VehicleList__stat-icon--purple">
            <FiArchive />
          </div>
          <div>
            <div className="VehicleList__stat-label">Inactive</div>
            <div className="VehicleList__stat-value">0</div>
            <div className="VehicleList__stat-sub">Inactive Fleet</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="VehicleList__filters-wrapper">
        <div className="VehicleList__filters">
          <div className="VehicleList__search-box">
            <FiSearch className="VehicleList__search-icon" />
            <input
              type="text"
              placeholder="Search vehicles by name or license plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dynamic Brand Dropdown */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="VehicleList__select"
          >
            {uniqueBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          {/* Dynamic Category/Type Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="VehicleList__select"
          >
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Availability Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="VehicleList__select"
          >
            <option value="All Status">All Status</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <button
            className={`VehicleList__btn-more ${
              showMoreFilters ? "VehicleList__btn-more--active" : ""
            }`}
            onClick={() => setShowMoreFilters(!showMoreFilters)}
          >
            <FiFilter /> More Filters
          </button>

          <button className="VehicleList__btn-reset" onClick={handleResetFilters}>
            <FiRotateCcw /> Reset
          </button>

          <button className="VehicleList__btn-apply" onClick={handleApplyFilters}>
            Apply Filters
          </button>
        </div>

        {/* Collapsible Panel */}
        {showMoreFilters && (
          <div className="VehicleList__more-panel">
            <div className="VehicleList__more-group">
              <label>Fuel Type:</label>
              <select
                value={fuelFilter}
                onChange={(e) => setFuelFilter(e.target.value)}
                className="VehicleList__select"
              >
                <option value="All">All</option>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="VehicleList__table-container">
        {loading ? (
          <div className="VehicleList__loading">Loading vehicles from database...</div>
        ) : error ? (
          <div className="VehicleList__error">{error}</div>
        ) : (
          <table className="VehicleList__table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      currentData.length > 0 &&
                      currentData.every((v) => selectedVehicles.includes(v._id))
                    }
                  />
                </th>
                <th>VEHICLE</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STATUS</th>
                <th>MILEAGE</th>
                <th>ADDED ON</th>
                <th style={{ textAlign: "right" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((v) => {
                  const name = `${v.vehicleBrand} ${v.vehicleModel} ${v.variantLine || ""}`;
                  const thumb =
                    v.images && v.images.length > 0
                      ? v.images[0]
                      : "https://via.placeholder.com/100x70?text=No+Image";

                  return (
                    <tr key={v._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedVehicles.includes(v._id)}
                          onChange={() => handleSelectOne(v._id)}
                        />
                      </td>
                      <td>
                        <div className="VehicleList__cell-vehicle">
                          <img
                            src={thumb}
                            alt={name}
                            className="VehicleList__car-thumb"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/100x70?text=No+Image";
                            }}
                          />
                          <div>
                            <div className="VehicleList__car-name">{name}</div>
                            <div className="VehicleList__car-plate">{v.registrationNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="VehicleList__cell-category">
                          <div className="VehicleList__category-title">
                            <FaCar className="VehicleList__type-icon" /> {v.vehicleType}
                          </div>
                          <div className="VehicleList__category-sub">
                            {v.fuelType} • {v.transmission}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="VehicleList__price-primary">
                          ₹{v.dailyRentPrice?.toLocaleString()} <span className="VehicleList__price-unit">/ Day</span>
                        </div>
                        <div className="VehicleList__price-secondary">
                          ₹{v.monthlyRentPrice?.toLocaleString()} / Month
                        </div>
                      </td>
                      <td>
                        <span
                          className={`VehicleList__badge VehicleList__badge--${(
                            v.availabilityStatus || "Available"
                          ).toLowerCase()}`}
                        >
                          {v.availabilityStatus}
                        </span>
                      </td>
                      <td className="VehicleList__text-muted">{v.mileage || "N/A"}</td>
                      <td className="VehicleList__text-muted">{formatDate(v.createdAt)}</td>
                      <td>
                        <div className="VehicleList__actions">
                          <button
                            className="VehicleList__action-btn VehicleList__action-btn--view"
                            title="View Details"
                            onClick={() => setViewModalVehicle(v)}
                          >
                            <FiEye />
                          </button>
                          <button
                            className="VehicleList__action-btn VehicleList__action-btn--edit"
                            title="Edit Vehicle"
                            onClick={() => setEditModalVehicle(v)}
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="VehicleList__action-btn VehicleList__action-btn--delete"
                            title="Delete Vehicle"
                            onClick={() => handleDelete(v._id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="VehicleList__no-data">
                    No vehicles found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer & Dynamic Pagination Controls */}
      <div className="VehicleList__footer">
        <div className="VehicleList__footer-info">
          Showing{" "}
          {filteredVehicles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of{" "}
          {filteredVehicles.length} vehicles
        </div>

        <div className="VehicleList__pagination">
          <button
            className="VehicleList__page-nav"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FiChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <button
              key={page}
              className={`VehicleList__page-btn ${
                currentPage === page ? "VehicleList__page-btn--active" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="VehicleList__page-nav"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {viewModalVehicle && (
        <div className="VehicleList__modal-overlay" onClick={() => setViewModalVehicle(null)}>
          <div className="VehicleList__modal" onClick={(e) => e.stopPropagation()}>
            <div className="VehicleList__modal-header">
              <h3>Vehicle Details</h3>
              <button
                className="VehicleList__modal-close"
                onClick={() => setViewModalVehicle(null)}
              >
                <FiX />
              </button>
            </div>
            <div className="VehicleList__modal-body">
              <img
                src={
                  viewModalVehicle.images && viewModalVehicle.images.length > 0
                    ? viewModalVehicle.images[0]
                    : "https://via.placeholder.com/400x250?text=No+Image"
                }
                alt={viewModalVehicle.vehicleModel}
                className="VehicleList__modal-img"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
                }}
              />
              <div className="VehicleList__modal-info">
                <h2>{`${viewModalVehicle.vehicleBrand} ${viewModalVehicle.vehicleModel}`}</h2>
                <p className="VehicleList__modal-plate">{viewModalVehicle.registrationNumber}</p>

                <div className="VehicleList__modal-grid">
                  <div>
                    <strong>Variant:</strong> {viewModalVehicle.variantLine}
                  </div>
                  <div>
                    <strong>Category:</strong> {viewModalVehicle.vehicleType}
                  </div>
                  <div>
                    <strong>Transmission:</strong> {viewModalVehicle.transmission}
                  </div>
                  <div>
                    <strong>Fuel Type:</strong> {viewModalVehicle.fuelType}
                  </div>
                  <div>
                    <strong>Year:</strong> {viewModalVehicle.yearOfManufacture}
                  </div>
                  <div>
                    <strong>Color:</strong> {viewModalVehicle.color}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`VehicleList__badge VehicleList__badge--${(
                        viewModalVehicle.availabilityStatus || "Available"
                      ).toLowerCase()}`}
                    >
                      {viewModalVehicle.availabilityStatus}
                    </span>
                  </div>
                  <div>
                    <strong>Daily Rate:</strong> ₹{viewModalVehicle.dailyRentPrice}
                  </div>
                  <div>
                    <strong>Deposit:</strong> ₹{viewModalVehicle.securityDeposit}
                  </div>
                  <div>
                    <strong>Added On:</strong> {formatDate(viewModalVehicle.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalVehicle && (
        <div className="VehicleList__modal-overlay" onClick={() => setEditModalVehicle(null)}>
          <div
            className="VehicleList__modal VehicleList__modal--edit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="VehicleList__modal-header">
              <h3>Edit Vehicle</h3>
              <button
                className="VehicleList__modal-close"
                onClick={() => setEditModalVehicle(null)}
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleEditSave} className="VehicleList__modal-form">
              <div className="VehicleList__form-group">
                <label>Vehicle Brand</label>
                <input
                  type="text"
                  value={editModalVehicle.vehicleBrand || ""}
                  onChange={(e) =>
                    setEditModalVehicle({ ...editModalVehicle, vehicleBrand: e.target.value })
                  }
                  required
                />
              </div>
              <div className="VehicleList__form-group">
                <label>Vehicle Model</label>
                <input
                  type="text"
                  value={editModalVehicle.vehicleModel || ""}
                  onChange={(e) =>
                    setEditModalVehicle({ ...editModalVehicle, vehicleModel: e.target.value })
                  }
                  required
                />
              </div>
              <div className="VehicleList__form-group">
                <label>Registration Number</label>
                <input
                  type="text"
                  value={editModalVehicle.registrationNumber || ""}
                  onChange={(e) =>
                    setEditModalVehicle({ ...editModalVehicle, registrationNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div className="VehicleList__form-group">
                <label>Status</label>
                <select
                  value={editModalVehicle.availabilityStatus || "Available"}
                  onChange={(e) =>
                    setEditModalVehicle({ ...editModalVehicle, availabilityStatus: e.target.value })
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="VehicleList__form-group">
                <label>Daily Price (₹)</label>
                <input
                  type="number"
                  value={editModalVehicle.dailyRentPrice || 0}
                  onChange={(e) =>
                    setEditModalVehicle({ ...editModalVehicle, dailyRentPrice: e.target.value })
                  }
                  required
                />
              </div>
              <div className="VehicleList__modal-footer">
                <button
                  type="button"
                  className="VehicleList__btn-reset"
                  onClick={() => setEditModalVehicle(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="VehicleList__btn-apply">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleList;