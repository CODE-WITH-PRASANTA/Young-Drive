import React, { useState } from "react";

// Feather Icons
import {
  FiUploadCloud,
  FiPlus,
  FiX,
  FiSave,
  FiCheck,
  FiInfo,
} from "react-icons/fi";

// Font Awesome Icons
import { FaCar, FaCarSide, FaGasPump, FaCogs, FaKey } from "react-icons/fa";

import "./AddNewVehicle.css";

// Key features options
const FEATURE_OPTIONS = [
  "Air Conditioning",
  "Power Steering",
  "ABS",
  "Airbags",
  "Bluetooth",
  "GPS Navigation",
  "Rear Camera",
  "USB Charger",
  "Alloy Wheels",
  "Cruise Control",
];

const AddNewVehicle = () => {
  // Form State
  const [formData, setFormData] = useState({
    vehicleBrand: "Audi",
    vehicleModel: "A3",
    variantLine: "1.6 TDI S line",
    vehicleType: "Sedan",
    fuelType: "Diesel",
    transmission: "Automatic",
    yearOfManufacture: "2024",
    registrationNumber: "MH12 AB 1234",
    seatingCapacity: "5 Seats",
    color: "White",
    mileage: "25,100 miles",
    doors: "4 Doors",
    description:
      "Stylish and efficient sedan with premium interiors, advanced safety features, and excellent performance.",
    keyFeatures: [
      "Air Conditioning",
      "Power Steering",
      "ABS",
      "Airbags",
      "Bluetooth",
      "GPS Navigation",
      "Rear Camera",
      "USB Charger",
      "Alloy Wheels",
    ],
    insuranceProvider: "HDFC Ergo",
    policyNumber: "HDFC12345678",
    validTill: "2025-12-31",
    dailyRentPrice: "4,500.00",
    weeklyRentPrice: "28,000.00",
    monthlyRentPrice: "95,000.00",
    securityDeposit: "10,000.00",
    extraKmCharge: "15.00",
    minimumBookingDays: "1 Day",
    availabilityStatus: "Available",
  });

  // Images State
  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400",
  ]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Feature Checkbox Toggle
  const handleFeatureToggle = (feature) => {
    setFormData((prev) => {
      const exists = prev.keyFeatures.includes(feature);
      return {
        ...prev,
        keyFeatures: exists
          ? prev.keyFeatures.filter((f) => f !== feature)
          : [...prev.keyFeatures, feature],
      };
    });
  };

  // Image Upload Handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImageUrls = files.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImageUrls]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, images };
    console.log("Vehicle Saved Successfully:", payload);
    alert("Vehicle saved successfully! Check browser console for output.");
  };

  // Cancel Handler
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to discard changes?")) {
      window.location.reload();
    }
  };

  return (
    <div className="AddNewVehicle">
      {/* Top Header */}
      <div className="AddNewVehicle__header">
        <div>
          <h1 className="AddNewVehicle__title">
            Add New Vehicle <FaCar className="AddNewVehicle__title-icon" />
          </h1>
          <div className="AddNewVehicle__breadcrumb">
            Dashboard &gt; Vehicles &gt; <span>Add New Vehicle</span>
          </div>
        </div>
        <div className="AddNewVehicle__header-actions">
          <button
            type="button"
            className="AddNewVehicle__btn-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="AddNewVehicle__btn-save"
            onClick={handleSubmit}
          >
            <FiSave /> Save Vehicle
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <form className="AddNewVehicle__grid" onSubmit={handleSubmit}>
        {/* Left Column */}
        <div className="AddNewVehicle__col-left">
          {/* Section 1: Basic Information */}
          <div className="AddNewVehicle__card">
            <div className="AddNewVehicle__card-header">
              <FaCarSide className="AddNewVehicle__card-icon" />
              <h3>Basic Information</h3>
            </div>

            <div className="AddNewVehicle__form-row">
              {/* INPUT TYPE: Vehicle Brand */}
              <div className="AddNewVehicle__form-group">
                <label>
                  Vehicle Brand <span>*</span>
                </label>
                <input
                  type="text"
                  name="vehicleBrand"
                  value={formData.vehicleBrand}
                  onChange={handleChange}
                  placeholder="e.g. Audi"
                  required
                />
              </div>

              {/* INPUT TYPE: Vehicle Model */}
              <div className="AddNewVehicle__form-group">
                <label>
                  Vehicle Model <span>*</span>
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  placeholder="e.g. A3"
                  required
                />
              </div>

              {/* INPUT TYPE: Variant / Line */}
              <div className="AddNewVehicle__form-group">
                <label>
                  Variant / Line <span>*</span>
                </label>
                <input
                  type="text"
                  name="variantLine"
                  value={formData.variantLine}
                  onChange={handleChange}
                  placeholder="e.g. 1.6 TDI S line"
                  required
                />
              </div>
            </div>

            <div className="AddNewVehicle__form-row">
              {/* INPUT TYPE: Vehicle Type */}
              <div className="AddNewVehicle__form-group">
                <label>
                  Vehicle Type <span>*</span>
                </label>
                <input
                  type="text"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  placeholder="e.g. Sedan"
                  required
                />
              </div>

              {/* Dropdown: Fuel Type */}
              <div className="AddNewVehicle__form-group">
                <label>
                  Fuel Type <span>*</span>
                </label>
                <div className="AddNewVehicle__input-icon-wrapper">
                  <FaGasPump className="AddNewVehicle__input-icon" />
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Dropdown: Transmission */}
              <div className="AddNewVehicle__form-group">
                <label>
                  Transmission <span>*</span>
                </label>
                <div className="AddNewVehicle__input-icon-wrapper">
                  <FaCogs className="AddNewVehicle__input-icon" />
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="AddNewVehicle__form-row">
              {/* INPUT TYPE: Year of Manufacture */}
              <div className="AddNewVehicle__form-group">
                <label>
                  Year of Manufacture <span>*</span>
                </label>
                <input
                  type="text"
                  name="yearOfManufacture"
                  value={formData.yearOfManufacture}
                  onChange={handleChange}
                  placeholder="e.g. 2024"
                  required
                />
              </div>

              {/* INPUT TYPE: Registration Number */}
              <div className="AddNewVehicle__form-group">
                <label>
                  Registration Number <span>*</span>
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="e.g. MH12 AB 1234"
                  required
                />
              </div>

              {/* INPUT TYPE: Seating Capacity */}
              <div className="AddNewVehicle__form-group">
                <label>
                  Seating Capacity <span>*</span>
                </label>
                <input
                  type="text"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  placeholder="e.g. 5 Seats"
                  required
                />
              </div>
            </div>

            <div className="AddNewVehicle__form-row">
              {/* Dropdown: Color */}
              <div className="AddNewVehicle__form-group">
                <label>
                  Color <span>*</span>
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                >
                  <option value="White">White</option>
                  <option value="Black">Black</option>
                  <option value="Silver">Silver</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                </select>
              </div>

              {/* INPUT TYPE: Mileage */}
              <div className="AddNewVehicle__form-group">
                <label>Mileage</label>
                <input
                  type="text"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  placeholder="e.g. 25,100 miles"
                />
              </div>

              {/* Dropdown: Doors */}
              <div className="AddNewVehicle__form-group">
                <label>Doors</label>
                <select
                  name="doors"
                  value={formData.doors}
                  onChange={handleChange}
                >
                  <option value="2 Doors">2 Doors</option>
                  <option value="4 Doors">4 Doors</option>
                  <option value="5 Doors">5 Doors</option>
                </select>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="AddNewVehicle__form-group AddNewVehicle__form-group--full">
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                maxLength="300"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter vehicle description..."
              />
              <div className="AddNewVehicle__char-count">
                {formData.description.length} / 300
              </div>
            </div>
          </div>

          {/* Section 2: Specifications & Features */}
          <div className="AddNewVehicle__card">
            <div className="AddNewVehicle__card-header">
              <FaKey className="AddNewVehicle__card-icon" />
              <h3>Specifications &amp; Features</h3>
            </div>

            <div className="AddNewVehicle__features-group">
              <label className="AddNewVehicle__sub-label">Key Features</label>
              <div className="AddNewVehicle__features-grid">
                {FEATURE_OPTIONS.map((feature) => {
                  const isChecked = formData.keyFeatures.includes(feature);
                  return (
                    <button
                      type="button"
                      key={feature}
                      className={`AddNewVehicle__feature-chip ${
                        isChecked ? "AddNewVehicle__feature-chip--active" : ""
                      }`}
                      onClick={() => handleFeatureToggle(feature)}
                    >
                      <span className="AddNewVehicle__chip-checkbox">
                        {isChecked && <FiCheck />}
                      </span>
                      {feature}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Insurance Details */}
            <div className="AddNewVehicle__insurance-section">
              <label className="AddNewVehicle__sub-label">
                Insurance Details
              </label>
              <div className="AddNewVehicle__form-row">
                <div className="AddNewVehicle__form-group">
                  <label>Insurance Provider</label>
                  <select
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                  >
                    <option value="HDFC Ergo">HDFC Ergo</option>
                    <option value="Bajaj Allianz">Bajaj Allianz</option>
                    <option value="ICICI Lombard">ICICI Lombard</option>
                    <option value="Tata AIG">Tata AIG</option>
                  </select>
                </div>

                <div className="AddNewVehicle__form-group">
                  <label>Policy Number</label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="AddNewVehicle__form-group">
                  <label>Valid Till</label>
                  <input
                    type="date"
                    name="validTill"
                    value={formData.validTill}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="AddNewVehicle__col-right">
          {/* Section 3: Vehicle Images */}
          <div className="AddNewVehicle__card">
            <div className="AddNewVehicle__card-header">
              <FiUploadCloud className="AddNewVehicle__card-icon" />
              <h3>Vehicle Images</h3>
            </div>

            {/* Drag and Drop Zone */}
            <div className="AddNewVehicle__upload-box">
              <FiUploadCloud className="AddNewVehicle__upload-icon" />
              <p>Drag &amp; drop images here or</p>
              <label htmlFor="vehicle-image-upload" className="AddNewVehicle__btn-upload">
                <FiUploadCloud /> Upload Images
              </label>
              <input
                id="vehicle-image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <span className="AddNewVehicle__upload-hint">
                Max 5MB per image, JPG, PNG, WEBP allowed
              </span>
            </div>

            {/* Image Gallery */}
            <div className="AddNewVehicle__gallery">
              {images.map((imgUrl, index) => (
                <div className="AddNewVehicle__gallery-item" key={index}>
                  <img src={imgUrl} alt={`Vehicle upload ${index + 1}`} />
                  <button
                    type="button"
                    className="AddNewVehicle__gallery-remove"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}

              {/* Add More Button */}
              <label
                htmlFor="vehicle-image-addmore"
                className="AddNewVehicle__gallery-addmore"
              >
                <FiPlus />
                <span>Add More</span>
              </label>
              <input
                id="vehicle-image-addmore"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Section 4: Pricing & Availability */}
          <div className="AddNewVehicle__card">
            <div className="AddNewVehicle__card-header">
              <FiInfo className="AddNewVehicle__card-icon" />
              <h3>Pricing &amp; Availability</h3>
            </div>

            <div className="AddNewVehicle__form-row">
              <div className="AddNewVehicle__form-group">
                <label>
                  Daily Rent Price <span>*</span>
                </label>
                <div className="AddNewVehicle__price-input">
                  <span>₹</span>
                  <input
                    type="text"
                    name="dailyRentPrice"
                    value={formData.dailyRentPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="AddNewVehicle__form-group">
                <label>Weekly Rent Price</label>
                <div className="AddNewVehicle__price-input">
                  <span>₹</span>
                  <input
                    type="text"
                    name="weeklyRentPrice"
                    value={formData.weeklyRentPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="AddNewVehicle__form-group">
                <label>Monthly Rent Price</label>
                <div className="AddNewVehicle__price-input">
                  <span>₹</span>
                  <input
                    type="text"
                    name="monthlyRentPrice"
                    value={formData.monthlyRentPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="AddNewVehicle__form-row">
              <div className="AddNewVehicle__form-group">
                <label>
                  Security Deposit <span>*</span>
                </label>
                <div className="AddNewVehicle__price-input">
                  <span>₹</span>
                  <input
                    type="text"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="AddNewVehicle__form-group">
                <label>Extra KM Charge (per km)</label>
                <div className="AddNewVehicle__price-input">
                  <span>₹</span>
                  <input
                    type="text"
                    name="extraKmCharge"
                    value={formData.extraKmCharge}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* INPUT TYPE: Minimum Booking Days */}
              <div className="AddNewVehicle__form-group">
                <label>
                  Minimum Booking Days <span>*</span>
                </label>
                <input
                  type="text"
                  name="minimumBookingDays"
                  value={formData.minimumBookingDays}
                  onChange={handleChange}
                  placeholder="e.g. 1 Day"
                  required
                />
              </div>
            </div>

            {/* Availability Status Toggle */}
            <div className="AddNewVehicle__form-group">
              <label>
                Availability Status <span>*</span>
              </label>
              <div className="AddNewVehicle__status-toggle">
                <button
                  type="button"
                  className={`AddNewVehicle__status-btn ${
                    formData.availabilityStatus === "Available"
                      ? "AddNewVehicle__status-btn--available"
                      : ""
                  }`}
                  onClick={() =>
                    setFormData((p) => ({ ...p, availabilityStatus: "Available" }))
                  }
                >
                  Available
                </button>
                <button
                  type="button"
                  className={`AddNewVehicle__status-btn ${
                    formData.availabilityStatus === "Unavailable"
                      ? "AddNewVehicle__status-btn--unavailable"
                      : ""
                  }`}
                  onClick={() =>
                    setFormData((p) => ({ ...p, availabilityStatus: "Unavailable" }))
                  }
                >
                  Unavailable
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewVehicle;