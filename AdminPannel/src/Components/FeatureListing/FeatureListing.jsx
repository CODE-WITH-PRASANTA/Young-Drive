import React, { useState, useEffect } from "react";

import {
  FaCar,
  FaCloudUploadAlt,
  FaTimes,
  FaSave,
  FaUndo,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaGasPump,
  FaCogs,
  FaUser,
  FaMapMarkerAlt,
  FaStar,
  FaPlus,
  FaTachometerAlt,
} from "react-icons/fa";

import "./FeatureListing.css";

// =====================================================
// API
// =====================================================

const API_URL = "http://localhost:5000/api/listings";
const CATEGORY_API_URL = "http://localhost:5000/api/car-categories";
const BASE_URL = "http://localhost:5000";

// =====================================================
// EMPTY FORM
// =====================================================

const emptyForm = {
  _id: null,

  name: "",
  location: "",

  // NEW
  category: "",
  listingType: "Featured Listings Cars",

  price: "",
  offerPrice: "",

  rating: "4.96",
  reviewsCount: "672",

  mileage: "25,100 miles",
  fuelType: "Diesel",
  transmission: "Automatic",
  seats: "7 seats",
  doors: "4 Doors",
  driveType: "FWD",

  order: "",
  status: "Active",

  shortDesc: "",
  fullDesc: "",
};

// =====================================================
// COMPONENT
// =====================================================

export function FeatureListing() {
  // =====================================================
  // LISTINGS
  // =====================================================

  const [listings, setListings] = useState([]);

  // =====================================================
  // CATEGORY
  // =====================================================

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] =
    useState(false);

  // =====================================================
  // FORM
  // =====================================================

  const [formData, setFormData] =
    useState(emptyForm);

  const [isEditing, setIsEditing] =
    useState(false);

  // =====================================================
  // IMAGES
  // =====================================================

  const [existingImages, setExistingImages] =
    useState([]);

  const [newImageFiles, setNewImageFiles] =
    useState([]);

  const [newImagePreviews, setNewImagePreviews] =
    useState([]);

  // =====================================================
  // FILTERS
  // =====================================================

  const [searchQuery, setSearchQuery] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Display Order");

  // =====================================================
  // SELECTION
  // =====================================================

  const [selectedIds, setSelectedIds] =
    useState([]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  // =====================================================
  // FETCH LISTINGS + CATEGORIES
  // =====================================================

  useEffect(() => {
    fetchListings();
    fetchCategories();
  }, []);

  // =====================================================
  // FETCH LISTINGS
  // =====================================================

  const fetchListings = async () => {
    try {
      const response = await fetch(API_URL);

      const data = await response.json();

      console.log(
        "LISTINGS RESPONSE:",
        data
      );

      if (Array.isArray(data)) {
        setListings(data);
        return;
      }

      if (data?.success && Array.isArray(data.data)) {
        setListings(data.data);
        return;
      }

      setListings([]);
    } catch (error) {
      console.error(
        "ERROR FETCHING LISTINGS:",
        error
      );

      setListings([]);
    }
  };

  // =====================================================
  // FETCH CAR CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);

      const response = await fetch(
        CATEGORY_API_URL
      );

      const data = await response.json();

      console.log(
        "CAR CATEGORIES RESPONSE:",
        data
      );

      if (
        data?.success &&
        Array.isArray(data.data)
      ) {
        setCategories(data.data);
      } else if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error(
        "FETCH CATEGORIES ERROR:",
        error
      );

      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageUpload = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    setNewImageFiles((prev) => [
      ...prev,
      ...files,
    ]);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setNewImagePreviews((prev) => [
      ...prev,
      ...previews,
    ]);

    e.target.value = "";
  };

  // =====================================================
  // REMOVE EXISTING IMAGE
  // =====================================================

  const handleRemoveExistingImage = (
    index
  ) => {
    setExistingImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // =====================================================
  // REMOVE NEW IMAGE
  // =====================================================

  const handleRemoveNewImage = (
    index
  ) => {
    setNewImageFiles((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );

    setNewImagePreviews((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const handleResetForm = () => {
    newImagePreviews.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setFormData({
      ...emptyForm,
    });

    setExistingImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);

    setIsEditing(false);
  };

  // =====================================================
  // SAVE / UPDATE LISTING
  // =====================================================

  const handleSaveListing = async (
    e,
    shouldAddAnother = false
  ) => {
    if (e) {
      e.preventDefault();
    }

    // =================================================
    // VALIDATION
    // =================================================

    if (
      !formData.name ||
      !formData.location ||
      !formData.price ||
      !formData.category ||
      !formData.listingType
    ) {
      alert(
        "Please fill in all required fields including Car Category and Listing Type."
      );

      return;
    }

    // =================================================
    // FORM DATA
    // =================================================

    const submitData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "_id") {
        submitData.append(
          key,
          formData[key] || ""
        );
      }
    });

    // =================================================
    // NEW IMAGES
    // =================================================

    newImageFiles.forEach((file) => {
      submitData.append(
        "images",
        file
      );
    });

    // =================================================
    // EXISTING IMAGES
    // =================================================

    submitData.append(
      "existingImages",
      JSON.stringify(existingImages)
    );

    // =================================================
    // DEBUG
    // =================================================

    console.log(
      "===================================="
    );

    console.log(
      isEditing
        ? "UPDATING LISTING"
        : "CREATING LISTING"
    );

    console.log(
      "FORM DATA:",
      {
        ...formData,
      }
    );

    console.log(
      "CATEGORY:",
      formData.category
    );

    console.log(
      "LISTING TYPE:",
      formData.listingType
    );

    console.log(
      "===================================="
    );

    try {
      // =================================================
      // UPDATE
      // =================================================

      if (isEditing) {
        const response = await fetch(
          `${API_URL}/${formData._id}`,
          {
            method: "PUT",
            body: submitData,
          }
        );

        const data = await response
          .json()
          .catch(() => ({}));

        console.log(
          "UPDATE LISTING RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to update listing."
          );
        }

        alert(
          "Featured listing updated successfully!"
        );
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        const response = await fetch(
          API_URL,
          {
            method: "POST",
            body: submitData,
          }
        );

        const data = await response
          .json()
          .catch(() => ({}));

        console.log(
          "CREATE LISTING RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to create listing."
          );
        }

        alert(
          "New listing added successfully!"
        );
      }

      // =================================================
      // REFRESH
      // =================================================

      await fetchListings();

      // =================================================
      // RESET
      // =================================================

      if (!shouldAddAnother) {
        handleResetForm();
      } else {
        setFormData({
          ...emptyForm,
        });

        setExistingImages([]);
        setNewImageFiles([]);
        setNewImagePreviews([]);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(
        "ERROR SAVING LISTING:",
        error
      );

      alert(
        error?.message ||
          "Error saving listing."
      );
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (listing) => {
    console.log(
      "EDIT LISTING:",
      listing
    );

    // ---------------------------------------------------
    // CATEGORY ID
    // ---------------------------------------------------

    let categoryId = "";

    if (
      typeof listing.category ===
      "string"
    ) {
      categoryId =
        listing.category;
    }

    if (
      listing.category &&
      typeof listing.category ===
        "object"
    ) {
      categoryId =
        listing.category._id ||
        listing.category.id ||
        "";
    }

    if (
      !categoryId &&
      listing.categoryId
    ) {
      categoryId =
        listing.categoryId;
    }

    // ---------------------------------------------------
    // LISTING TYPE
    // ---------------------------------------------------

    const listingType =
      listing.listingType ||
      "Featured Listings Cars";

    // ---------------------------------------------------
    // FORM
    // ---------------------------------------------------

    setFormData({
      ...emptyForm,

      ...listing,

      _id:
        listing._id ||
        listing.id ||
        null,

      name:
        listing.name || "",

      location:
        listing.location || "",

      category:
        categoryId,

      listingType,

      price:
        listing.price ?? "",

      offerPrice:
        listing.offerPrice ?? "",

      rating:
        listing.rating ??
        "4.96",

      reviewsCount:
        listing.reviewsCount ??
        "672",

      mileage:
        listing.mileage ||
        "25,100 miles",

      fuelType:
        listing.fuelType ||
        "Diesel",

      transmission:
        listing.transmission ||
        "Automatic",

      seats:
        listing.seats ||
        "7 seats",

      doors:
        listing.doors ||
        "4 Doors",

      driveType:
        listing.driveType ||
        "FWD",

      order:
        listing.order ?? "",

      status:
        listing.status ||
        "Active",

      shortDesc:
        listing.shortDesc ||
        "",

      fullDesc:
        listing.fullDesc ||
        "",
    });

    // ---------------------------------------------------
    // IMAGES
    // ---------------------------------------------------

    setExistingImages(
      Array.isArray(listing.images)
        ? listing.images
        : []
    );

    setNewImageFiles([]);
    setNewImagePreviews([]);

    // ---------------------------------------------------
    // EDIT MODE
    // ---------------------------------------------------

    setIsEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this listing?"
      )
    ) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response
          .json()
          .catch(() => ({}));

      console.log(
        "DELETE RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete listing."
        );
      }

      setListings((prev) =>
        prev.filter(
          (item) =>
            item._id !== id
        )
      );

      setSelectedIds((prev) =>
        prev.filter(
          (item) =>
            item !== id
        )
      );

      alert(
        "Listing deleted successfully."
      );
    } catch (error) {
      console.error(
        "ERROR DELETING LISTING:",
        error
      );

      alert(
        error?.message ||
          "Error deleting listing."
      );
    }
  };

  // =====================================================
  // FORMAT TEXT
  // =====================================================

  const handleFormatText = (
    wrapperTag
  ) => {
    const textarea =
      document.getElementById(
        "FeatureListing-fullDescTextarea"
      );

    if (!textarea) {
      return;
    }

    const start =
      textarea.selectionStart;

    const end =
      textarea.selectionEnd;

    const text =
      textarea.value;

    let replacement = "";

    switch (wrapperTag) {
      case "bold":
        replacement = `**${
          text.substring(
            start,
            end
          ) || "Bold text"
        }**`;
        break;

      case "italic":
        replacement = `*${
          text.substring(
            start,
            end
          ) || "Italic text"
        }*`;
        break;

      case "ul":
        replacement = `\n- ${
          text.substring(
            start,
            end
          ) || "List item"
        }`;
        break;

      case "ol":
        replacement = `\n1. ${
          text.substring(
            start,
            end
          ) || "List item"
        }`;
        break;

      case "link":
        replacement = `[${
          text.substring(
            start,
            end
          ) || "link text"
        }](https://example.com)`;
        break;

      case "image":
        replacement =
          "![alt text](https://images.unsplash.com/photo-...)";
        break;

      default:
        return;
    }

    const updatedText =
      text.substring(0, start) +
      replacement +
      text.substring(end);

    setFormData((prev) => ({
      ...prev,
      fullDesc: updatedText,
    }));
  };

  // =====================================================
  // SELECT ALL
  // =====================================================

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(
        currentListings.map(
          (l) => l._id
        )
      );
    } else {
      setSelectedIds([]);
    }
  };

  // =====================================================
  // SELECT ONE
  // =====================================================

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) =>
              item !== id
          )
        : [...prev, id]
    );
  };

  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredListings =
    listings
      .filter((l) => {
        const name =
          String(
            l.name || ""
          ).toLowerCase();

        const location =
          String(
            l.location || ""
          ).toLowerCase();

        const search =
          searchQuery.toLowerCase();

        const matchesSearch =
          name.includes(search) ||
          location.includes(search);

        const matchesStatus =
          filterStatus === "All" ||
          l.status ===
            filterStatus;

        return (
          matchesSearch &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        if (
          sortBy ===
          "Display Order"
        ) {
          return (
            Number(a.order || 0) -
            Number(b.order || 0)
          );
        }

        if (
          sortBy ===
          "Price: Low to High"
        ) {
          return (
            Number(a.price || 0) -
            Number(b.price || 0)
          );
        }

        if (
          sortBy ===
          "Price: High to Low"
        ) {
          return (
            Number(b.price || 0) -
            Number(a.price || 0)
          );
        }

        if (
          sortBy === "Rating"
        ) {
          return (
            Number(b.rating || 0) -
            Number(a.rating || 0)
          );
        }

        return 0;
      });

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages =
    Math.ceil(
      filteredListings.length /
        itemsPerPage
    ) || 1;

  const indexOfLastItem =
    currentPage *
    itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem -
    itemsPerPage;

  const currentListings =
    filteredListings.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

  // =====================================================
  // GET CATEGORY NAME
  // =====================================================

  const getCategoryName = (
    listing
  ) => {
    if (
      listing?.category &&
      typeof listing.category ===
        "object"
    ) {
      return (
        listing.category.name ||
        "-"
      );
    }

    const category =
      categories.find(
        (item) =>
          item._id ===
          listing?.category
      );

    return (
      category?.name || "-"
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="FeatureListing-container">

      {/* HEADER */}

      <div className="FeatureListing-header">
        <div>
          <h1>
            Featured Listings
          </h1>

          <p className="FeatureListing-breadcrumb">
            Dashboard &gt; Featured
            Listings &gt;{" "}
            <span>
              {isEditing
                ? "Edit Listing"
                : "Add / Manage"}
            </span>
          </p>
        </div>
      </div>

      <div className="FeatureListing-grid">

        {/* =====================================================
            FORM
        ===================================================== */}

        <div className="FeatureListing-card FeatureListing-form-section">

          <div className="FeatureListing-card-header">
            <h3>
              <FaStar className="FeatureListing-icon-accent" />{" "}
              {isEditing
                ? "Edit Listing"
                : "Add / Edit Featured Listing"}
            </h3>
          </div>

          <form
            onSubmit={(e) =>
              handleSaveListing(
                e,
                false
              )
            }
            className="FeatureListing-form"
          >

            {/* =================================================
                IMAGES
            ================================================= */}

            <div className="FeatureListing-field-group">

              <label className="FeatureListing-label">
                Vehicle Images{" "}
                <span className="required">
                  *
                </span>
              </label>

              <label className="FeatureListing-dropzone">

                <FaCloudUploadAlt className="FeatureListing-drop-icon" />

                <p>
                  Drag &amp; drop
                  images here or
                </p>

                <span className="FeatureListing-browse-btn">
                  Browse Files
                </span>

                <small>
                  Auto-converts to
                  optimized WebP.
                  (Max 2MB)
                </small>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={
                    handleImageUpload
                  }
                  style={{
                    display: "none",
                  }}
                />

              </label>

              <div className="FeatureListing-image-thumbnails">

                {/* EXISTING */}

                {existingImages.map(
                  (img, idx) => (
                    <div
                      key={`exist-${idx}`}
                      className="FeatureListing-thumb-box"
                    >
                      <img
                        src={`${BASE_URL}${img}`}
                        alt={`Thumbnail ${idx}`}
                      />

                      <button
                        type="button"
                        className="FeatureListing-thumb-remove"
                        onClick={() =>
                          handleRemoveExistingImage(
                            idx
                          )
                        }
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )
                )}

                {/* NEW */}

                {newImagePreviews.map(
                  (img, idx) => (
                    <div
                      key={`new-${idx}`}
                      className="FeatureListing-thumb-box"
                    >
                      <img
                        src={img}
                        alt={`New Thumbnail ${idx}`}
                      />

                      <button
                        type="button"
                        className="FeatureListing-thumb-remove"
                        onClick={() =>
                          handleRemoveNewImage(
                            idx
                          )
                        }
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )
                )}

                {/* ADD */}

                <label className="FeatureListing-thumb-add">

                  <FaPlus />

                  <span>
                    Add
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={
                      handleImageUpload
                    }
                    style={{
                      display: "none",
                    }}
                  />

                </label>

              </div>
            </div>

            {/* =================================================
                VEHICLE NAME
            ================================================= */}

            <div className="FeatureListing-field">

              <label className="FeatureListing-label">
                Vehicle Name{" "}
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="name"
                placeholder="e.g. Volvo S60 D4 R-Design"
                value={
                  formData.name
                }
                onChange={
                  handleInputChange
                }
                required
              />

            </div>

            {/* =================================================
                CAR CATEGORY - NEW
            ================================================= */}

            <div className="FeatureListing-field">

              <label className="FeatureListing-label">
                Car Category{" "}
                <span className="required">
                  *
                </span>
              </label>

              <div className="FeatureListing-select-wrapper">

                <select
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                >

                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select Car Category"}
                  </option>

                  {categories
                    .filter(
                      (category) =>
                        category.status !==
                          "Inactive"
                    )
                    .map(
                      (category) => (
                        <option
                          key={
                            category._id
                          }
                          value={
                            category._id
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      )
                    )}

                </select>

              </div>

            </div>

            {/* =================================================
                LISTING TYPE - NEW
            ================================================= */}

            <div className="FeatureListing-field">

              <label className="FeatureListing-label">
                Listing Type{" "}
                <span className="required">
                  *
                </span>
              </label>

              <div className="FeatureListing-select-wrapper">

                <select
                  name="listingType"
                  value={
                    formData.listingType
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                >

                  <option value="Featured Listings Cars">
                    Featured Listings Cars
                  </option>

                  <option value="Most Searched Cars">
                    Most Searched Cars
                  </option>

                </select>

              </div>

            </div>

            {/* =================================================
                LOCATION
            ================================================= */}

            <div className="FeatureListing-field">

              <label className="FeatureListing-label">
                Location{" "}
                <span className="required">
                  *
                </span>
              </label>

              <div className="FeatureListing-input-with-icon">

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. New South Wales, Australia"
                  value={
                    formData.location
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

                <FaMapMarkerAlt className="input-suffix-icon" />

              </div>

            </div>

            {/* =================================================
                PRICE
            ================================================= */}

            <div className="FeatureListing-form-grid-3">

              <div className="FeatureListing-field">

                <label className="FeatureListing-label">
                  Price / Day (₹){" "}
                  <span className="required">
                    *
                  </span>
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="7800"
                  value={
                    formData.price
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>

              <div className="FeatureListing-field">

                <label className="FeatureListing-label">
                  Rating
                </label>

                <input
                  type="text"
                  name="rating"
                  placeholder="4.96"
                  value={
                    formData.rating
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>

              <div className="FeatureListing-field">

                <label className="FeatureListing-label">
                  Reviews Count
                </label>

                <input
                  type="text"
                  name="reviewsCount"
                  placeholder="672"
                  value={
                    formData.reviewsCount
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>

            </div>

            {/* =================================================
                SPECIFICATIONS
            ================================================= */}

            <div className="FeatureListing-specs-title">
              Specifications
            </div>

            <div className="FeatureListing-form-grid">

              {/* MILEAGE */}

              <div className="FeatureListing-field">

                <label className="FeatureListing-label">
                  <FaGasPump className="spec-label-icon" />{" "}
                  Mileage
                </label>

                <input
                  type="text"
                  name="mileage"
                  placeholder="25,100 miles"
                  value={
                    formData.mileage
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>

              {/* SEATS */}

              <div className="FeatureListing-field">

                <label className="FeatureListing-label">
                  <FaUser className="spec-label-icon" />{" "}
                  Seating Capacity
                </label>

                <div className="FeatureListing-select-wrapper">

                  <select
                    name="seats"
                    value={
                      formData.seats
                    }
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="5 seats">
                      5 seats
                    </option>

                    <option value="7 seats">
                      7 seats
                    </option>

                    <option value="9 seats">
                      9 seats
                    </option>
                  </select>

                </div>

              </div>

              {/* FUEL */}

              <div className="FeatureListing-field">

                <label className="FeatureListing-label">
                  <FaCogs className="spec-label-icon" />{" "}
                  Fuel Type
                </label>

                <div className="FeatureListing-select-wrapper">

                  <select
                    name="fuelType"
                    value={
                      formData.fuelType
                    }
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="Diesel">
                      Diesel
                    </option>

                    <option value="Petrol">
                      Petrol
                    </option>

                    <option value="Hybrid">
                      Hybrid
                    </option>

                    <option value="Electric">
                      Electric
                    </option>
                  </select>

                </div>

              </div>

              {/* DOORS */}

              <div className="FeatureListing-field">

                <label className="FeatureListing-label">
                  <FaCar className="spec-label-icon" />{" "}
                  Doors
                </label>

                <div className="FeatureListing-select-wrapper">

                  <select
                    name="doors"
                    value={
                      formData.doors
                    }
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="2 Doors">
                      2 Doors
                    </option>

                    <option value="4 Doors">
                      4 Doors
                    </option>

                    <option value="5 Doors">
                      5 Doors
                    </option>
                  </select>

                </div>

              </div>

              {/* TRANSMISSION */}

              <div className="FeatureListing-field">

                <label className="FeatureListing-label">
                  <FaCogs className="spec-label-icon" />{" "}
                  Transmission
                </label>

                <div className="FeatureListing-select-wrapper">

                  <select
                    name="transmission"
                    value={
                      formData.transmission
                    }
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="Automatic">
                      Automatic
                    </option>

                    <option value="Manual">
                      Manual
                    </option>
                  </select>

                </div>

              </div>

              {/* DRIVE */}

              <div className="FeatureListing-field">

                <label className="FeatureListing-label">
                  <FaCar className="spec-label-icon" />{" "}
                  Drive Type
                </label>

                <div className="FeatureListing-select-wrapper">

                  <select
                    name="driveType"
                    value={
                      formData.driveType
                    }
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="FWD">
                      FWD
                    </option>

                    <option value="RWD">
                      RWD
                    </option>

                    <option value="AWD">
                      AWD
                    </option>

                    <option value="4WD">
                      4WD
                    </option>
                  </select>

                </div>

              </div>

            </div>

            {/* =================================================
                ORDER + STATUS
            ================================================= */}

            <div className="FeatureListing-form-grid">

              <div className="FeatureListing-field">

                <label className="FeatureListing-label">
                  Display Order{" "}
                  <span className="required">
                    *
                  </span>
                </label>

                <input
                  type="number"
                  name="order"
                  placeholder="2"
                  value={
                    formData.order
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>

              <div className="FeatureListing-field">

                <label className="FeatureListing-label">
                  Status{" "}
                  <span className="required">
                    *
                  </span>
                </label>

                <div className="FeatureListing-select-wrapper">

                  <select
                    name="status"
                    value={
                      formData.status
                    }
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

              </div>

            </div>

            {/* =================================================
                SHORT DESCRIPTION
            ================================================= */}

            <div className="FeatureListing-field">

              <label className="FeatureListing-label">
                Short Description
              </label>

              <input
                type="text"
                name="shortDesc"
                placeholder="e.g. Premium sedan with excellent fuel efficiency."
                value={
                  formData.shortDesc
                }
                onChange={
                  handleInputChange
                }
              />

            </div>

            {/* =================================================
                FULL DESCRIPTION
            ================================================= */}

            <div className="FeatureListing-field">

              <label className="FeatureListing-label">
                Full Description
              </label>

              <div className="FeatureListing-editor-wrapper">

                <div className="FeatureListing-editor-toolbar">

                  <button
                    type="button"
                    onClick={() =>
                      handleFormatText(
                        "bold"
                      )
                    }
                    title="Bold"
                  >
                    <FaBold />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleFormatText(
                        "italic"
                      )
                    }
                    title="Italic"
                  >
                    <FaItalic />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleFormatText(
                        "ul"
                      )
                    }
                    title="Bullet List"
                  >
                    <FaListUl />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleFormatText(
                        "ol"
                      )
                    }
                    title="Numbered List"
                  >
                    <FaListOl />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleFormatText(
                        "link"
                      )
                    }
                    title="Insert Link"
                  >
                    <FaLink />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleFormatText(
                        "image"
                      )
                    }
                    title="Insert Image"
                  >
                    <FaImage />
                  </button>

                </div>

                <textarea
                  id="FeatureListing-fullDescTextarea"
                  name="fullDesc"
                  rows="4"
                  placeholder="Write detailed description about the vehicle..."
                  value={
                    formData.fullDesc
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>

            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="FeatureListing-form-actions">

              <button
                type="submit"
                className="FeatureListing-btn-save"
              >
                <FaSave />

                {isEditing
                  ? "Update Listing"
                  : "Save Listing"}
              </button>

              <button
                type="button"
                className="FeatureListing-btn-save-another"
                onClick={(e) =>
                  handleSaveListing(
                    e,
                    true
                  )
                }
              >
                Save &amp; Add Another
              </button>

              <button
                type="button"
                className="FeatureListing-btn-reset"
                onClick={
                  handleResetForm
                }
              >
                <FaUndo />

                Reset
              </button>

            </div>

          </form>
        </div>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="FeatureListing-card FeatureListing-table-section">

          <div className="FeatureListing-table-controls">

            <div className="FeatureListing-card-header">

              <h3>
                <FaStar className="FeatureListing-icon-accent" />{" "}
                All Featured Listings
              </h3>

            </div>

            {/* FILTER BAR */}

            <div className="FeatureListing-filter-bar">

              <div className="FeatureListing-search-box">

                <FaSearch className="FeatureListing-search-icon" />

                <input
                  type="text"
                  placeholder="Search listings..."
                  value={
                    searchQuery
                  }
                  onChange={(e) => {
                    setSearchQuery(
                      e.target.value
                    );

                    setCurrentPage(
                      1
                    );
                  }}
                />

              </div>

              <div className="FeatureListing-select-wrapper filter-select-wrap">

                <select
                  value={
                    filterStatus
                  }
                  onChange={(e) => {
                    setFilterStatus(
                      e.target.value
                    );

                    setCurrentPage(
                      1
                    );
                  }}
                >
                  <option value="All">
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

              <div className="FeatureListing-select-wrapper sort-select-wrap">

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value
                    )
                  }
                >
                  <option value="Display Order">
                    Sort: Order
                  </option>

                  <option value="Price: Low to High">
                    Price: Low to High
                  </option>

                  <option value="Price: High to Low">
                    Price: High to Low
                  </option>

                  <option value="Rating">
                    Sort: Rating
                  </option>
                </select>

              </div>

              <button
                type="button"
                className="FeatureListing-btn-filter"
                onClick={() => {
                  setSearchQuery(
                    ""
                  );

                  setFilterStatus(
                    "All"
                  );

                  setSortBy(
                    "Display Order"
                  );

                  setCurrentPage(
                    1
                  );
                }}
              >
                <FaFilter />

                Reset
              </button>

            </div>
          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="FeatureListing-table-wrapper">

            <table className="FeatureListing-table">

              <thead>

                <tr>

                  <th
                    style={{
                      width: "38px",
                    }}
                  >
                    <input
                      type="checkbox"
                      onChange={
                        handleSelectAll
                      }
                      checked={
                        currentListings.length >
                          0 &&
                        currentListings.every(
                          (l) =>
                            selectedIds.includes(
                              l._id
                            )
                        )
                      }
                    />
                  </th>

                  <th
                    style={{
                      width: "30px",
                    }}
                  >
                    #
                  </th>

                  <th
                    style={{
                      width: "80px",
                    }}
                  >
                    Image
                  </th>

                  <th className="vehicle-th-header">
                    Vehicle Details
                  </th>

                  <th
                    style={{
                      width: "130px",
                    }}
                  >
                    Location
                  </th>

                  <th
                    style={{
                      width: "95px",
                    }}
                  >
                    Price / Day
                  </th>

                  <th
                    style={{
                      width: "90px",
                    }}
                  >
                    Rating
                  </th>

                  <th
                    style={{
                      width: "75px",
                    }}
                  >
                    Status
                  </th>

                  <th
                    style={{
                      width: "45px",
                    }}
                  >
                    Order
                  </th>

                  <th
                    style={{
                      width: "75px",
                      textAlign:
                        "right",
                    }}
                  >
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentListings.length ===
                0 ? (
                  <tr>

                    <td
                      colSpan="10"
                      className="FeatureListing-empty-cell"
                    >
                      No featured
                      listings
                      found.
                    </td>

                  </tr>
                ) : (
                  currentListings.map(
                    (
                      item,
                      index
                    ) => (
                      <tr
                        key={
                          item._id
                        }
                        className={
                          selectedIds.includes(
                            item._id
                          )
                            ? "selected-row"
                            : ""
                        }
                      >

                        {/* CHECKBOX */}

                        <td>

                          <input
                            type="checkbox"
                            checked={selectedIds.includes(
                              item._id
                            )}
                            onChange={() =>
                              handleSelectOne(
                                item._id
                              )
                            }
                          />

                        </td>

                        {/* NUMBER */}

                        <td className="row-number-cell">
                          {indexOfFirstItem +
                            index +
                            1}
                        </td>

                        {/* IMAGE */}

                        <td>

                          <img
                            src={
                              item.images
                                ?.length >
                              0
                                ? `${BASE_URL}${item.images[0]}`
                                : ""
                            }
                            alt={
                              item.name
                            }
                            className="FeatureListing-table-img"
                          />

                        </td>

                        {/* VEHICLE */}

                        <td>

                          <div className="FeatureListing-car-cell">

                            <h4
                              className="FeatureListing-car-title"
                              title={
                                item.name
                              }
                            >
                              {
                                item.name
                              }
                            </h4>

                            <div className="FeatureListing-car-specs-tags">

                              <span className="spec-tag">
                                {
                                  item.fuelType
                                }
                              </span>

                              <span className="spec-tag">
                                {
                                  item.transmission
                                }
                              </span>

                              <span className="spec-tag">
                                {
                                  item.seats
                                }
                              </span>

                            </div>

                            <div className="FeatureListing-mileage-tag">

                              <FaTachometerAlt className="mileage-icon" />

                              <span>
                                {
                                  item.mileage
                                }
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* LOCATION */}

                        <td className="FeatureListing-location-cell">

                          <FaMapMarkerAlt className="location-pin" />

                          <span>
                            {
                              item.location
                            }
                          </span>

                        </td>

                        {/* PRICE */}

                        <td className="FeatureListing-price-cell">

                          <strong>
                            ₹
                            {Number(
                              item.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                          <span className="per-day">
                            /day
                          </span>

                        </td>

                        {/* RATING */}

                        <td>

                          <div className="FeatureListing-rating-cell">

                            <div className="rating-top">

                              <FaStar className="star-icon" />

                              <strong>
                                {Number(
                                  item.rating ||
                                    0
                                ).toFixed(
                                  2
                                )}
                              </strong>

                            </div>

                            <span className="reviews-count">
                              (
                              {
                                item.reviewsCount
                              }
                              )
                            </span>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`FeatureListing-badge ${
                              String(
                                item.status ||
                                  ""
                              ).toLowerCase()
                            }`}
                          >
                            {
                              item.status
                            }
                          </span>

                        </td>

                        {/* ORDER */}

                        <td>

                          <span className="FeatureListing-order-pill">
                            {
                              item.order
                            }
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="FeatureListing-action-btns">

                            <button
                              type="button"
                              className="btn-edit"
                              title="Edit"
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                            >
                              <FaEdit />
                            </button>

                            <button
                              type="button"
                              className="btn-delete"
                              title="Delete"
                              onClick={() =>
                                handleDelete(
                                  item._id
                                )
                              }
                            >
                              <FaTrash />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          <div className="FeatureListing-table-footer">

            <div className="FeatureListing-pagination-right-group">

              <div className="FeatureListing-per-page-wrap">

                <span className="per-page-label">
                  Show:
                </span>

                <select
                  value={
                    itemsPerPage
                  }
                  onChange={(e) => {
                    setItemsPerPage(
                      Number(
                        e.target.value
                      )
                    );

                    setCurrentPage(
                      1
                    );
                  }}
                  className="per-page-select"
                >
                  <option value={5}>
                    5 / page
                  </option>

                  <option value={10}>
                    10 / page
                  </option>

                  <option value={15}>
                    15 / page
                  </option>

                  <option value={20}>
                    20 / page
                  </option>
                </select>

              </div>

              <span className="FeatureListing-pagination-info">

                {filteredListings.length
                  ? `${indexOfFirstItem + 1}-${Math.min(
                      indexOfLastItem,
                      filteredListings.length
                    )} of ${
                      filteredListings.length
                    }`
                  : "0 items"}

              </span>

              <div className="FeatureListing-pagination">

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        Math.max(
                          prev - 1,
                          1
                        )
                    )
                  }
                >
                  Prev
                </button>

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, i) => (
                    <button
                      type="button"
                      key={
                        i + 1
                      }
                      className={
                        currentPage ===
                        i + 1
                          ? "active"
                          : ""
                      }
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
                  type="button"
                  disabled={
                    currentPage ===
                      totalPages ||
                    totalPages ===
                      0
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        Math.min(
                          prev + 1,
                          totalPages
                        )
                    )
                  }
                >
                  Next
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default FeatureListing;