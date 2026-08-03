import React, { useState, useMemo } from "react";

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

// Font Awesome Icons (Separate import path)
import { FaCar } from "react-icons/fa";

import "./VehicleList.css";

// Initial mock data based on reference image
const INITIAL_VEHICLES = [
  {
    id: 1,
    name: "Audi A3 1.6 TDI S line",
    plate: "MH12 AB 1234",
    brand: "Audi",
    type: "Sedan",
    fuel: "Diesel",
    transmission: "Automatic",
    priceDay: "$498.25",
    priceMonth: "$9,800",
    status: "Available",
    mileage: "25,100 miles",
    addedOn: "May 12, 2025",
    image:
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    name: "Mercedes-Benz C220d",
    plate: "MH12 CD 5678",
    brand: "Mercedes-Benz",
    type: "Sedan",
    fuel: "Diesel",
    transmission: "Automatic",
    priceDay: "$525.50",
    priceMonth: "$10,500",
    status: "Booked",
    mileage: "32,200 miles",
    addedOn: "May 10, 2025",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    name: "Volkswagen Golf GTD",
    plate: "MH12 EF 9012",
    brand: "Volkswagen",
    type: "Hatchback",
    fuel: "Diesel",
    transmission: "Automatic",
    priceDay: "$450.75",
    priceMonth: "$8,900",
    status: "Maintenance",
    mileage: "18,750 miles",
    addedOn: "May 09, 2025",
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    name: "Volvo S60 D4 R-Design",
    plate: "MH12 GH 3456",
    brand: "Volvo",
    type: "Sedan",
    fuel: "Diesel",
    transmission: "Automatic",
    priceDay: "$480.00",
    priceMonth: "$9,200",
    status: "Available",
    mileage: "27,300 miles",
    addedOn: "May 08, 2025",
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 5,
    name: "Hyundai Creta SX",
    plate: "MH12 IJ 7890",
    brand: "Hyundai",
    type: "SUV",
    fuel: "Petrol",
    transmission: "Manual",
    priceDay: "$550.00",
    priceMonth: "$11,000",
    status: "Unavailable",
    mileage: "21,400 miles",
    addedOn: "May 07, 2025",
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 6,
    name: "Jaguar XE 2.0d R-Sport",
    plate: "MH12 KL 2468",
    brand: "Jaguar",
    type: "Sedan",
    fuel: "Diesel",
    transmission: "Automatic",
    priceDay: "$575.25",
    priceMonth: "$12,000",
    status: "Available",
    mileage: "15,600 miles",
    addedOn: "May 06, 2025",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400",
  },
];

const VehicleList = () => {
  // State Management
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("All Brands");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // More Filters Toggle & Custom State
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [fuelFilter, setFuelFilter] = useState("All");

  // Active Applied Filters
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
  const itemsPerPage = 6;

  // Filter Logic
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

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        item.plate.toLowerCase().includes(appliedFilters.search.toLowerCase());
      const matchesBrand =
        appliedFilters.brand === "All Brands" || item.brand === appliedFilters.brand;
      const matchesType =
        appliedFilters.type === "All Types" || item.type === appliedFilters.type;
      const matchesStatus =
        appliedFilters.status === "All Status" || item.status === appliedFilters.status;
      const matchesFuel =
        appliedFilters.fuel === "All" || item.fuel === appliedFilters.fuel;

      return matchesSearch && matchesBrand && matchesType && matchesStatus && matchesFuel;
    });
  }, [vehicles, appliedFilters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVehicles(currentData.map((v) => v.id));
    } else {
      setSelectedVehicles([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedVehicles((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      setVehicles((prev) => prev.filter((item) => item.id !== id));
      setSelectedVehicles((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleExport = () => {
    const dataToExport = selectedVehicles.length
      ? vehicles.filter((v) => selectedVehicles.includes(v.id))
      : filteredVehicles;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Plate,Type,Status,Price/Day,Mileage"]
        .concat(
          dataToExport.map(
            (v) =>
              `"${v.name}","${v.plate}","${v.type}","${v.status}","${v.priceDay}","${v.mileage}"`
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

  const handleEditSave = (e) => {
    e.preventDefault();
    setVehicles((prev) =>
      prev.map((v) => (v.id === editModalVehicle.id ? editModalVehicle : v))
    );
    setEditModalVehicle(null);
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
            <FiDownload /> Export
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
            <div className="VehicleList__stat-sub">All Vehicles</div>
          </div>
        </div>

        <div className="VehicleList__stat-card">
          <div className="VehicleList__stat-icon VehicleList__stat-icon--green">
            <FiCheckCircle />
          </div>
          <div>
            <div className="VehicleList__stat-label">Available</div>
            <div className="VehicleList__stat-value">
              {vehicles.filter((v) => v.status === "Available").length}
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
              {vehicles.filter((v) => v.status === "Unavailable" || v.status === "Booked").length}
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
              {vehicles.filter((v) => v.status === "Maintenance").length}
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
            <div className="VehicleList__stat-value">2</div>
            <div className="VehicleList__stat-sub">Inactive Vehicles</div>
          </div>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="VehicleList__filters-wrapper">
        <div className="VehicleList__filters">
          <div className="VehicleList__search-box">
            <FiSearch className="VehicleList__search-icon" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="VehicleList__select"
          >
            <option value="All Brands">All Brands</option>
            <option value="Audi">Audi</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Volvo">Volvo</option>
            <option value="Hyundai">Hyundai</option>
            <option value="Jaguar">Jaguar</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="VehicleList__select"
          >
            <option value="All Types">All Types</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="SUV">SUV</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="VehicleList__select"
          >
            <option value="All Status">All Status</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Unavailable">Unavailable</option>
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

        {/* Collapsible More Filters Panel */}
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
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="VehicleList__table-container">
        <table className="VehicleList__table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    currentData.length > 0 &&
                    currentData.every((v) => selectedVehicles.includes(v.id))
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
              currentData.map((v) => (
                <tr key={v.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(v.id)}
                      onChange={() => handleSelectOne(v.id)}
                    />
                  </td>
                  <td>
                    <div className="VehicleList__cell-vehicle">
                      <img
                        src={v.image}
                        alt={v.name}
                        className="VehicleList__car-thumb"
                      />
                      <div>
                        <div className="VehicleList__car-name">{v.name}</div>
                        <div className="VehicleList__car-plate">{v.plate}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="VehicleList__cell-category">
                      <div className="VehicleList__category-title">
                        <FaCar className="VehicleList__type-icon" /> {v.type}
                      </div>
                      <div className="VehicleList__category-sub">
                        {v.fuel} • {v.transmission}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="VehicleList__price-primary">
                      {v.priceDay} <span className="VehicleList__price-unit">/ Day</span>
                    </div>
                    <div className="VehicleList__price-secondary">
                      {v.priceMonth} / Month
                    </div>
                  </td>
                  <td>
                    <span
                      className={`VehicleList__badge VehicleList__badge--${v.status.toLowerCase()}`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="VehicleList__text-muted">{v.mileage}</td>
                  <td className="VehicleList__text-muted">{v.addedOn}</td>
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
                        onClick={() => handleDelete(v.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="VehicleList__no-data">
                  No vehicles found matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
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
          <div
            className="VehicleList__modal"
            onClick={(e) => e.stopPropagation()}
          >
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
                src={viewModalVehicle.image}
                alt={viewModalVehicle.name}
                className="VehicleList__modal-img"
              />
              <div className="VehicleList__modal-info">
                <h2>{viewModalVehicle.name}</h2>
                <p className="VehicleList__modal-plate">{viewModalVehicle.plate}</p>

                <div className="VehicleList__modal-grid">
                  <div>
                    <strong>Category:</strong> {viewModalVehicle.type}
                  </div>
                  <div>
                    <strong>Transmission:</strong> {viewModalVehicle.transmission}
                  </div>
                  <div>
                    <strong>Fuel Type:</strong> {viewModalVehicle.fuel}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span className={`VehicleList__badge VehicleList__badge--${viewModalVehicle.status.toLowerCase()}`}>
                      {viewModalVehicle.status}
                    </span>
                  </div>
                  <div>
                    <strong>Daily Rate:</strong> {viewModalVehicle.priceDay}
                  </div>
                  <div>
                    <strong>Monthly Rate:</strong> {viewModalVehicle.priceMonth}
                  </div>
                  <div>
                    <strong>Mileage:</strong> {viewModalVehicle.mileage}
                  </div>
                  <div>
                    <strong>Added On:</strong> {viewModalVehicle.addedOn}
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
                <label>Vehicle Name</label>
                <input
                  type="text"
                  value={editModalVehicle.name}
                  onChange={(e) =>
                    setEditModalVehicle({ ...editModalVehicle, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="VehicleList__form-group">
                <label>License Plate</label>
                <input
                  type="text"
                  value={editModalVehicle.plate}
                  onChange={(e) =>
                    setEditModalVehicle({ ...editModalVehicle, plate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="VehicleList__form-group">
                <label>Status</label>
                <select
                  value={editModalVehicle.status}
                  onChange={(e) =>
                    setEditModalVehicle({ ...editModalVehicle, status: e.target.value })
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <div className="VehicleList__form-group">
                <label>Daily Price</label>
                <input
                  type="text"
                  value={editModalVehicle.priceDay}
                  onChange={(e) =>
                    setEditModalVehicle({ ...editModalVehicle, priceDay: e.target.value })
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