import React, {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import "./Category.css";

const Category = () => {
  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      status: "Active",
      image: null,
    });

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [fetchLoading, setFetchLoading] =
    useState(true);

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  const [editingId, setEditingId] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [search, setSearch] =
    useState("");

  /* =====================================================
     API IMAGE URL
     ===================================================== */

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    const baseURL =
      API?.defaults?.baseURL ||
      "http://localhost:5000/api";

    try {
      const url = new URL(
        baseURL,
        window.location.origin
      );

      return `${url.origin}${
        image.startsWith("/")
          ? image
          : `/${image}`
      }`;
    } catch (error) {
      return image;
    }
  };

  /* =====================================================
     FETCH CATEGORIES
     ===================================================== */

  const fetchCategories = async () => {
    try {
      setFetchLoading(true);

      const response =
        await API.get(
          "/car-categories"
        );

      console.log(
        "CATEGORY LIST RESPONSE:",
        response.data
      );

      let categoryData = [];

      if (
        Array.isArray(
          response.data
        )
      ) {
        categoryData =
          response.data;
      } else if (
        Array.isArray(
          response.data?.data
        )
      ) {
        categoryData =
          response.data.data;
      } else if (
        Array.isArray(
          response.data?.categories
        )
      ) {
        categoryData =
          response.data.categories;
      } else if (
        Array.isArray(
          response.data?.data
            ?.categories
        )
      ) {
        categoryData =
          response.data.data.categories;
      }

      setCategories(
        categoryData
      );
    } catch (error) {
      console.error(
        "FETCH CATEGORIES ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );

      setCategories([]);

      alert(
        error?.response?.data
          ?.message ||
          "Failed to load categories."
      );
    } finally {
      setFetchLoading(false);
    }
  };

  /* =====================================================
     INITIAL FETCH
     ===================================================== */

  useEffect(() => {
    fetchCategories();
  }, []);

  /* =====================================================
     HANDLE CHANGE
     ===================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  /* =====================================================
     IMAGE CHANGE
     ===================================================== */

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select a valid image."
      );

      return;
    }

    setFormData(
      (prev) => ({
        ...prev,
        image: file,
      })
    );

    const previewUrl =
      URL.createObjectURL(
        file
      );

    setImagePreview(
      previewUrl
    );
  };

  /* =====================================================
     RESET FORM
     ===================================================== */

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "Active",
      image: null,
    });

    setEditingId(null);
    setImagePreview("");

    const fileInput =
      document.getElementById(
        "category-image"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  /* =====================================================
     SUBMIT
     ===================================================== */

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      !formData.name.trim()
    ) {
      alert(
        "Please enter category name."
      );

      return;
    }

    try {
      setLoading(true);

      const data =
        new FormData();

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "status",
        formData.status
      );

      if (formData.image) {
        data.append(
          "image",
          formData.image
        );
      }

      console.log(
        "CATEGORY PAYLOAD:",
        {
          name:
            formData.name,
          description:
            formData.description,
          status:
            formData.status,
          image:
            formData.image,
          editingId,
        }
      );

      let response;

      /* =================================================
         EDIT
         ================================================= */

      if (editingId) {
        response =
          await API.put(
            `/car-categories/${editingId}`,
            data
          );
      }

      /* =================================================
         CREATE
         ================================================= */

      else {
        response =
          await API.post(
            "/car-categories",
            data
          );
      }

      console.log(
        "CATEGORY RESPONSE:",
        response.data
      );

      if (
        response.data?.success ||
        response.status >=
          200 &&
        response.status < 300
      ) {
        alert(
          editingId
            ? "Car category updated successfully!"
            : "Car category created successfully!"
        );

        resetForm();

        await fetchCategories();
      } else {
        alert(
          response.data?.message ||
            "Failed to save category."
        );
      }
    } catch (error) {
      console.error(
        "SAVE CATEGORY ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );

      alert(
        error?.response?.data
          ?.message ||
          "Failed to save category."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     EDIT CATEGORY
     ===================================================== */

  const handleEdit = (
    category
  ) => {
    const categoryId =
      category?._id ||
      category?.id;

    if (!categoryId) {
      alert(
        "Category ID not found."
      );

      return;
    }

    setEditingId(
      categoryId
    );

    setFormData({
      name:
        category?.name || "",
      description:
        category?.description ||
        "",
      status:
        category?.status ||
        "Active",
      image: null,
    });

    const existingImage =
      category?.image ||
      category?.imageUrl ||
      category?.photo ||
      "";

    setImagePreview(
      getImageUrl(
        existingImage
      )
    );

    const fileInput =
      document.getElementById(
        "category-image"
      );

    if (fileInput) {
      fileInput.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     DELETE CATEGORY
     ===================================================== */

  const handleDelete = async (
    category
  ) => {
    const categoryId =
      category?._id ||
      category?.id;

    if (!categoryId) {
      alert(
        "Category ID not found."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${category.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(
        categoryId
      );

      const response =
        await API.delete(
          `/car-categories/${categoryId}`
        );

      console.log(
        "DELETE CATEGORY RESPONSE:",
        response.data
      );

      if (
        response.data?.success ||
        response.status >=
          200 &&
        response.status < 300
      ) {
        alert(
          "Category deleted successfully."
        );

        if (
          editingId ===
          categoryId
        ) {
          resetForm();
        }

        await fetchCategories();
      } else {
        alert(
          response.data?.message ||
            "Failed to delete category."
        );
      }
    } catch (error) {
      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );

      alert(
        error?.response?.data
          ?.message ||
          "Failed to delete category."
      );
    } finally {
      setDeleteLoading(
        null
      );
    }
  };

  /* =====================================================
     FILTER CATEGORIES
     ===================================================== */

  const filteredCategories =
    categories.filter(
      (category) => {
        const value =
          search
            .toLowerCase()
            .trim();

        if (!value) {
          return true;
        }

        return (
          category?.name
            ?.toLowerCase()
            .includes(value) ||
          category?.description
            ?.toLowerCase()
            .includes(value) ||
          category?.status
            ?.toLowerCase()
            .includes(value)
        );
      }
    );

  /* =====================================================
     RENDER
     ===================================================== */

  return (
    <div className="category-page">

      {/* =================================================
          LEFT / FORM
          ================================================= */}

      <div className="category-form-container">

        <div className="category-form-header">

          <div>
            <span className="category-eyebrow">
              CATEGORY MANAGEMENT
            </span>

            <h2>
              {editingId
                ? "Edit Car Category"
                : "Add Car Category"}
            </h2>

            <p>
              {editingId
                ? "Update your existing vehicle category."
                : "Create a new category for your vehicle fleet."}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              className="category-cancel-top"
              onClick={
                resetForm
              }
            >
              Cancel Edit
            </button>
          )}

        </div>

        <form
          className="category-form"
          onSubmit={
            handleSubmit
          }
        >

          {/* CATEGORY NAME */}

          <div className="form-group">

            <label htmlFor="category-name">
              Category Name
              <span>*</span>
            </label>

            <input
              id="category-name"
              type="text"
              name="name"
              placeholder="Enter category name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
            />

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label htmlFor="category-description">
              Description
            </label>

            <textarea
              id="category-description"
              name="description"
              placeholder="Enter category description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              rows="5"
            />

          </div>

          {/* IMAGE */}

          <div className="form-group">

            <label htmlFor="category-image">
              Category Image
            </label>

            <div className="category-upload-box">

              {imagePreview ? (
                <div className="category-preview-wrapper">

                  <img
                    src={
                      imagePreview
                    }
                    alt="Category preview"
                    className="category-preview-image"
                    onError={(
                      e
                    ) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                  <div className="category-preview-overlay">

                    <span>
                      Image Selected
                    </span>

                  </div>

                </div>
              ) : (
                <div className="category-upload-content">

                  <div className="category-upload-icon">
                    ↑
                  </div>

                  <strong>
                    Upload category image
                  </strong>

                  <span>
                    PNG, JPG, WEBP up to 5MB
                  </span>

                </div>
              )}

              <input
                id="category-image"
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
              />

            </div>

            {formData.image && (
              <p className="selected-file">
                Selected:{" "}
                {
                  formData
                    .image
                    .name
                }
              </p>
            )}

          </div>

          {/* STATUS */}

          <div className="form-group">

            <label htmlFor="category-status">
              Status
            </label>

            <select
              id="category-status"
              name="status"
              value={
                formData.status
              }
              onChange={
                handleChange
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

          {/* SUBMIT */}

          <div className="form-actions">

            {editingId && (
              <button
                type="button"
                className="category-secondary-btn"
                onClick={
                  resetForm
                }
                disabled={
                  loading
                }
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={
                loading
              }
            >
              {loading
                ? editingId
                  ? "Updating..."
                  : "Saving..."
                : editingId
                ? "Update Category"
                : "Add Category"}
            </button>

          </div>

        </form>

      </div>

      {/* =================================================
          RIGHT / CATEGORY LIST
          ================================================= */}

      <div className="category-list-container">

        <div className="category-list-header">

          <div>

            <span className="category-eyebrow">
              YOUR CATEGORIES
            </span>

            <h2>
              Car Categories
            </h2>

            <p>
              Manage all your vehicle categories
            </p>

          </div>

          <div className="category-count">

            <strong>
              {categories.length}
            </strong>

            <span>
              Total
            </span>

          </div>

        </div>

        {/* SEARCH */}

        <div className="category-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
            >
              ×
            </button>
          )}

        </div>

        {/* CATEGORY LIST */}

        <div className="category-list">

          {fetchLoading ? (
            <div className="category-loading">

              <div className="category-spinner"></div>

              <p>
                Loading categories...
              </p>

            </div>
          ) : filteredCategories.length ===
            0 ? (
            <div className="category-empty">

              <div className="category-empty-icon">
                +
              </div>

              <h3>
                No categories found
              </h3>

              <p>
                {search
                  ? "Try a different search."
                  : "Create your first car category using the form."}
              </p>

            </div>
          ) : (
            filteredCategories.map(
              (category) => {
                const categoryId =
                  category?._id ||
                  category?.id;

                const categoryImage =
                  getImageUrl(
                    category?.image ||
                      category?.imageUrl ||
                      category?.photo ||
                      ""
                  );

                return (
                  <div
                    className={`category-card ${
                      editingId ===
                      categoryId
                        ? "category-card-editing"
                        : ""
                    }`}
                    key={
                      categoryId
                    }
                  >

                    {/* IMAGE */}

                    <div className="category-card-image">

                      {categoryImage ? (
                        <img
                          src={
                            categoryImage
                          }
                          alt={
                            category.name
                          }
                          onError={(
                            e
                          ) => {
                            e.currentTarget.style.display =
                              "none";
                            e.currentTarget.parentElement.classList.add(
                              "image-error"
                            );
                          }}
                        />
                      ) : (
                        <div className="category-no-image">
                          <span>
                            {category?.name
                              ?.charAt(
                                0
                              )
                              ?.toUpperCase() ||
                              "C"}
                          </span>
                        </div>
                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="category-card-content">

                      <div className="category-card-top">

                        <div>

                          <h3>
                            {
                              category.name
                            }
                          </h3>

                          <span className="category-id">
                            ID:{" "}
                            {String(
                              categoryId
                            ).slice(
                              -8
                            )}
                          </span>

                        </div>

                        <span
                          className={`category-status ${
                            String(
                              category.status ||
                                "Active"
                            ).toLowerCase() ===
                            "active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          <span></span>

                          {
                            category.status ||
                            "Active"
                          }
                        </span>

                      </div>

                      <p className="category-description">

                        {category.description ||
                          "No description added for this category."}

                      </p>

                      <div className="category-card-footer">

                        <span className="category-created">

                          {category.createdAt
                            ? new Date(
                                category.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "Recently added"}

                        </span>

                        <div className="category-card-actions">

                          <button
                            type="button"
                            className="category-edit-btn"
                            onClick={() =>
                              handleEdit(
                                category
                              )
                            }
                            disabled={
                              loading ||
                              deleteLoading ===
                                categoryId
                            }
                            title="Edit Category"
                          >
                            ✎
                            <span>
                              Edit
                            </span>
                          </button>

                          <button
                            type="button"
                            className="category-delete-btn"
                            onClick={() =>
                              handleDelete(
                                category
                              )
                            }
                            disabled={
                              loading ||
                              deleteLoading ===
                                categoryId
                            }
                            title="Delete Category"
                          >
                            {deleteLoading ===
                            categoryId
                              ? "..."
                              : "⌫"}

                            <span>
                              Delete
                            </span>
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              }
            )
          )}

        </div>

      </div>

    </div>
  );
};

export default Category;