import React, { useState, useRef, useEffect } from "react";
import {
  FiUser,
  FiLock,
  FiSettings,
  FiCamera,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiShield,
  FiClock,
  FiArrowRight,
  FiX,
} from "react-icons/fi";

import "./MyProfile.css";
import API, { IMG_URL } from "../../api/axios";

const initialProfileData = {
  id: "DRVX-ADM-001",
  name: "Admin",
  email: "admin@drivex.com",
  phone: "202-555-0182",
  role: "Super Admin",
  address: "123 DriveX Street, New York, NY 10001, USA",
  language: "English",
  timeZone: "(UTC+05:30) India Standard Time",
  bio: "Administrator of DriveX car rental platform. Manage all operations and system settings.",
  status: "Active",
  created: "",
  lastLogin: "",
  avatar: null,
};

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState("Profile Settings");

  const [currentProfile, setCurrentProfile] =
    useState(initialProfileData);

  const [formData, setFormData] =
    useState(initialProfileData);

  const [loading, setLoading] = useState(true);

  const [profileSaving, setProfileSaving] =
    useState(false);

  const [avatarUploading, setAvatarUploading] =
    useState(false);

  const [passwordSaving, setPasswordSaving] =
    useState(false);

  const [preferencesSaving, setPreferencesSaving] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotif: true,
    smsNotif: false,
    darkMode: false,
    twoFactor: false,
  });

  const [loginActivity, setLoginActivity] =
    useState([]);

  const [isRightPanelVisible, setIsRightPanelVisible] =
    useState(true);

  const [showSecuritySettings, setShowSecuritySettings] =
    useState(false);

  const [showLoginActivity, setShowLoginActivity] =
    useState(false);

  const fileInputRef = useRef(null);

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =========================================================
     IMAGE URL HELPER
  ========================================================= */

  const getImageUrl = (avatar) => {
    if (!avatar) return null;

    // Complete URL
    if (
      avatar.startsWith("http://") ||
      avatar.startsWith("https://")
    ) {
      return avatar;
    }

    // Base64 compatibility
    if (avatar.startsWith("data:image/")) {
      return avatar;
    }

    const cleanPath = String(avatar).replace(/^\/+/, "");

    const cleanBaseUrl = IMG_URL
      ? IMG_URL.replace(/\/+$/, "")
      : "";

    return `${cleanBaseUrl}/${cleanPath}`;
  };

  /* =========================================================
     FETCH PROFILE + LOGIN ACTIVITY
  ========================================================= */

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);

        /* ---------------------------------------------
           GET CURRENT ADMIN
        --------------------------------------------- */

        const res = await API.get("/auth/me");

        const admin = res.data?.admin;

        if (admin) {
          const lastLoginActivity =
            admin.loginActivity?.length > 0
              ? admin.loginActivity[
                  admin.loginActivity.length - 1
                ]
              : null;

          const formatted = {
            id:
              admin._id ||
              admin.id ||
              "DRVX-ADM-001",

            name:
              admin.name ||
              "Admin",

            email:
              admin.email ||
              "",

            phone:
              admin.phone ||
              "",

            role:
              admin.role ||
              "Super Admin",

            address:
              admin.address ||
              "",

            language:
              admin.language ||
              "English",

            timeZone:
              admin.timeZone ||
              "(UTC+05:30) India Standard Time",

            bio:
              admin.bio ||
              "",

            status:
              admin.isActive === false
                ? "Inactive"
                : "Active",

            created:
              formatDate(admin.createdAt),

            lastLogin:
              formatDate(
                lastLoginActivity?.loginAt
              ),

            avatar:
              admin.avatar
                ? getImageUrl(admin.avatar)
                : null,
          };

          setCurrentProfile(formatted);

          setFormData(formatted);

          /* ---------------------------------------------
             PREFERENCES
          --------------------------------------------- */

          if (admin.preferences) {
            setPreferences({
              emailNotif:
                admin.preferences.emailNotif ??
                true,

              smsNotif:
                admin.preferences.smsNotif ??
                false,

              darkMode:
                admin.preferences.darkMode ??
                false,

              twoFactor:
                admin.preferences.twoFactor ??
                false,
            });
          }
        }

        /* ---------------------------------------------
           GET LOGIN ACTIVITY
        --------------------------------------------- */

        try {
          const activityRes =
            await API.get(
              "/auth/login-activity"
            );

          if (
            activityRes.data?.success &&
            Array.isArray(
              activityRes.data.activity
            )
          ) {
            setLoginActivity(
              activityRes.data.activity
            );
          } else {
            setLoginActivity([]);
          }
        } catch (activityError) {
          console.warn(
            "Login activity unavailable:",
            activityError
          );

          setLoginActivity([]);
        }
      } catch (error) {
        console.error(
          "Failed to load profile data:",
          error
        );

        alert(
          error.response?.data?.message ||
            "Failed to load profile data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     UPLOAD AVATAR
     
     PUT /api/auth/avatar
     
     FormData key:
     image
     
     Backend:
     upload.single("image")
  ========================================================= */

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    /* ---------------------------------------------
       VALIDATE FILE TYPE
    --------------------------------------------- */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Please select a JPG, PNG or WEBP image."
      );

      e.target.value = "";
      return;
    }

    /* ---------------------------------------------
       VALIDATE FILE SIZE
    --------------------------------------------- */

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "Image size must be less than 5MB."
      );

      e.target.value = "";
      return;
    }

    try {
      setAvatarUploading(true);

      /* ---------------------------------------------
         CREATE FORM DATA
      --------------------------------------------- */

      const imageFormData =
        new FormData();

      imageFormData.append(
        "image",
        file
      );

      /* ---------------------------------------------
         UPLOAD TO BACKEND
      --------------------------------------------- */

      const response =
        await API.put(
          "/auth/avatar",
          imageFormData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      /* ---------------------------------------------
         HANDLE RESPONSE
      --------------------------------------------- */

      if (
        response.data?.success &&
        response.data?.avatar
      ) {
        const avatarPath =
          response.data.avatar;

        const avatarUrl =
          getImageUrl(avatarPath);

        /* -----------------------------------------
           UPDATE CURRENT PROFILE
        ----------------------------------------- */

        setCurrentProfile((prev) => ({
          ...prev,
          avatar: avatarUrl,
        }));

        /* -----------------------------------------
           UPDATE FORM DATA

           Store backend path only.
           NEVER store Base64.
        ----------------------------------------- */

        setFormData((prev) => ({
          ...prev,
          avatar: avatarPath,
        }));

        alert(
          response.data.message ||
            "Profile picture updated successfully!"
        );
      } else {
        throw new Error(
          response.data?.message ||
            "Avatar upload failed."
        );
      }
    } catch (error) {
      console.error(
        "Avatar upload failed:",
        error
      );

      if (
        error.response?.status === 413
      ) {
        alert(
          "Image is too large. Please select a smaller image."
        );
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to upload profile picture."
        );
      }
    } finally {
      setAvatarUploading(false);

      // Allow same image to be selected again
      e.target.value = "";
    }
  };

  /* =========================================================
     PROFILE UPDATE

     IMPORTANT:
     Avatar is NOT uploaded here.

     Avatar uses:
     PUT /auth/avatar

     Profile uses:
     PUT /auth/profile
  ========================================================= */

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      setProfileSaving(true);

      /* ---------------------------------------------
         DO NOT SEND AVATAR
         
         This prevents Base64 / 413 issue.
      --------------------------------------------- */

      const profilePayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        language: formData.language,
        timeZone: formData.timeZone,
        bio: formData.bio,
      };

      const response =
        await API.put(
          "/auth/profile",
          profilePayload
        );

      if (
        response.data?.success &&
        response.data?.admin
      ) {
        const admin =
          response.data.admin;

        const updatedAvatar =
          admin.avatar
            ? getImageUrl(admin.avatar)
            : currentProfile.avatar;

        const updated = {
          ...currentProfile,

          id:
            admin._id ||
            currentProfile.id,

          name:
            admin.name ||
            formData.name,

          email:
            admin.email ||
            formData.email,

          phone:
            admin.phone ||
            formData.phone,

          role:
            admin.role ||
            currentProfile.role,

          address:
            admin.address ||
            "",

          language:
            admin.language ||
            "English",

          timeZone:
            admin.timeZone ||
            "(UTC+05:30) India Standard Time",

          bio:
            admin.bio ||
            "",

          status:
            admin.isActive === false
              ? "Inactive"
              : "Active",

          avatar: updatedAvatar,
        };

        setCurrentProfile(updated);

        setFormData((prev) => ({
          ...prev,

          name:
            admin.name ||
            prev.name,

          email:
            admin.email ||
            prev.email,

          phone:
            admin.phone ||
            prev.phone,

          address:
            admin.address ||
            "",

          language:
            admin.language ||
            prev.language,

          timeZone:
            admin.timeZone ||
            prev.timeZone,

          bio:
            admin.bio ||
            "",

          avatar:
            admin.avatar ||
            prev.avatar,
        }));

        alert(
          response.data.message ||
            "Profile updated successfully!"
        );
      } else {
        alert(
          response.data?.message ||
            "Profile update failed."
        );
      }
    } catch (error) {
      console.error(
        "Profile update failed:",
        error
      );

      if (
        error.response?.status === 413
      ) {
        alert(
          "Request is too large. Please try again without uploading the image from this form."
        );
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to update profile."
        );
      }
    } finally {
      setProfileSaving(false);
    }
  };

  /* =========================================================
     PASSWORD UPDATE
  ========================================================= */

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (
      !passwordData.current ||
      !passwordData.newPass ||
      !passwordData.confirm
    ) {
      alert(
        "Please fill all password fields."
      );

      return;
    }

    if (
      passwordData.newPass !==
      passwordData.confirm
    ) {
      alert(
        "New passwords don't match!"
      );

      return;
    }

    if (
      passwordData.newPass.length < 6
    ) {
      alert(
        "New password must contain at least 6 characters."
      );

      return;
    }

    try {
      setPasswordSaving(true);

      const response =
        await API.put(
          "/auth/password",
          {
            currentPassword:
              passwordData.current,

            newPassword:
              passwordData.newPass,
          }
        );

      alert(
        response.data?.message ||
          "Password changed successfully!"
      );

      setPasswordData({
        current: "",
        newPass: "",
        confirm: "",
      });
    } catch (error) {
      console.error(
        "Password update failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  /* =========================================================
     PREFERENCE CHANGE
  ========================================================= */

  const handlePreferenceChange = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* =========================================================
     SAVE PREFERENCES
  ========================================================= */

  const handlePreferencesUpdate = async () => {
    try {
      setPreferencesSaving(true);

      const response =
        await API.put(
          "/auth/preferences",
          preferences
        );

      if (
        response.data?.success &&
        response.data?.preferences
      ) {
        setPreferences(
          response.data.preferences
        );
      }

      alert(
        response.data?.message ||
          "Preferences saved successfully!"
      );
    } catch (error) {
      console.error(
        "Preferences update failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save preferences."
      );
    } finally {
      setPreferencesSaving(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="myprofile-container">
        <div
          style={{
            padding: "60px",
            textAlign: "center",
          }}
        >
          Loading profile...
        </div>
      </div>
    );
  }

  /* =========================================================
     AVATAR FOR PREVIEW
  ========================================================= */

  const profileAvatar =
    getImageUrl(formData.avatar);

  const currentAvatar =
    getImageUrl(currentProfile.avatar);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="myprofile-container">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="myprofile-header-wrapper">

        <div className="myprofile-title-group">
          <h1 className="myprofile-title">
            Settings
          </h1>

          <p className="myprofile-subtitle">
            Manage your profile and account security
          </p>
        </div>

        <div className="myprofile-header-right">
          <span className="myprofile-breadcrumb">
            Settings &gt; Profile &amp; Security
          </span>
        </div>

      </div>

      {/* =====================================================
          TABS
      ===================================================== */}

      <div className="myprofile-tabs-bar">

        {[
          {
            name: "Profile Settings",
            icon: <FiUser />,
          },
          {
            name: "Change Password",
            icon: <FiLock />,
          },
          {
            name: "Account Preferences",
            icon: <FiSettings />,
          },
        ].map((tab) => (
          <button
            key={tab.name}
            className={`myprofile-tab-btn ${
              activeTab === tab.name
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(tab.name)
            }
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}

      </div>

      {/* =====================================================
          PROFILE SETTINGS
      ===================================================== */}

      {activeTab === "Profile Settings" && (
        <div
          className={`myprofile-main-grid ${
            !isRightPanelVisible
              ? "single-column"
              : ""
          }`}
        >

          {/* =================================================
              LEFT FORM
          ================================================= */}

          <div className="myprofile-form-card">

            <div className="myprofile-card-header">

              <h3>
                Profile Information
              </h3>

              <p>
                Update your personal information
                and profile details
              </p>

            </div>

            <form
              onSubmit={handleProfileUpdate}
              className="myprofile-form"
            >

              {/* =================================================
                  AVATAR
              ================================================= */}

              <div className="myprofile-avatar-upload-section">

                <div className="myprofile-avatar-preview">

                  {profileAvatar ? (
                    <img
                      src={profileAvatar}
                      alt="Avatar"
                      className="myprofile-avatar-img"
                    />
                  ) : (
                    <div className="myprofile-avatar-fallback">
                      {formData.name
                        ? formData.name
                            .charAt(0)
                            .toUpperCase()
                        : "A"}
                    </div>
                  )}

                  <button
                    type="button"
                    className="myprofile-camera-btn"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? (
                      <span className="myprofile-avatar-loader">
                        ...
                      </span>
                    ) : (
                      <FiCamera />
                    )}
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={
                      handleImageUpload
                    }
                    accept="image/png, image/jpeg, image/webp"
                    style={{
                      display: "none",
                    }}
                  />

                </div>

                <span className="myprofile-upload-hint">
                  {avatarUploading
                    ? "Uploading profile picture..."
                    : "JPG, PNG or WEBP. Max size 5MB."}
                </span>

              </div>

              {/* =================================================
                  NAME + EMAIL
              ================================================= */}

              <div className="myprofile-form-row">

                <div className="myprofile-form-group">

                  <label>
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={
                      handleInputChange
                    }
                    required
                  />

                </div>

                <div className="myprofile-form-group">

                  <label>
                    Email Address *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={
                      handleInputChange
                    }
                    required
                  />

                </div>

              </div>

              {/* =================================================
                  PHONE + ROLE
              ================================================= */}

              <div className="myprofile-form-row">

                <div className="myprofile-form-group">

                  <label>
                    Phone Number *
                  </label>

                  <div className="myprofile-phone-input-wrap">

                    <select className="myprofile-country-code">
                      <option value="+1">
                        +1
                      </option>

                      <option value="+44">
                        +44
                      </option>

                      <option value="+91">
                        +91
                      </option>
                    </select>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={
                        handleInputChange
                      }
                      required
                    />

                  </div>

                </div>

                <div className="myprofile-form-group">

                  <label>
                    Role
                  </label>

                  <input
                    type="text"
                    value={formData.role}
                    disabled
                    className="myprofile-disabled-input"
                  />

                </div>

              </div>

              {/* =================================================
                  ADDRESS
              ================================================= */}

              <div className="myprofile-form-group">

                <label>
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={
                    handleInputChange
                  }
                  placeholder="Enter your address"
                />

              </div>

              {/* =================================================
                  LANGUAGE + TIMEZONE
              ================================================= */}

              <div className="myprofile-form-row">

                <div className="myprofile-form-group">

                  <label>
                    Language
                  </label>

                  <select
                    name="language"
                    value={formData.language}
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="English">
                      English
                    </option>

                    <option value="Spanish">
                      Spanish
                    </option>

                    <option value="French">
                      French
                    </option>

                    <option value="Hindi">
                      Hindi
                    </option>

                    <option value="Odia">
                      Odia
                    </option>
                  </select>

                </div>

                <div className="myprofile-form-group">

                  <label>
                    Time Zone
                  </label>

                  <select
                    name="timeZone"
                    value={formData.timeZone}
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="(UTC+05:30) India Standard Time">
                      (UTC+05:30) India Standard Time
                    </option>

                    <option value="(UTC-05:00) Eastern Time (US & Canada)">
                      (UTC-05:00) Eastern Time
                    </option>

                    <option value="(UTC-08:00) Pacific Time (US & Canada)">
                      (UTC-08:00) Pacific Time
                    </option>

                    <option value="(UTC+00:00) Greenwich Mean Time">
                      (UTC+00:00) Greenwich Mean Time
                    </option>
                  </select>

                </div>

              </div>

              {/* =================================================
                  BIO
              ================================================= */}

              <div className="myprofile-form-group">

                <label>
                  Bio
                </label>

                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={
                    handleInputChange
                  }
                  placeholder="Write something about yourself..."
                ></textarea>

              </div>

              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button
                type="submit"
                className="myprofile-submit-btn"
                disabled={
                  profileSaving ||
                  avatarUploading
                }
              >
                {profileSaving
                  ? "Updating Profile..."
                  : "Update Profile"}
              </button>

            </form>

          </div>

          {/* =================================================
              RIGHT PANEL
          ================================================= */}

          {isRightPanelVisible && (
            <div className="myprofile-right-panels">

              <button
                className="myprofile-close-panel-btn"
                onClick={() =>
                  setIsRightPanelVisible(false)
                }
              >
                <FiX />
              </button>

              {/* =================================================
                  PROFILE PREVIEW
              ================================================= */}

              <div className="myprofile-preview-card">

                <h4>
                  Profile Preview
                </h4>

                <p className="myprofile-preview-sub">
                  This is how your profile appears
                </p>

                <div className="myprofile-preview-box">

                  <div className="myprofile-preview-avatar">

                    {currentAvatar ? (
                      <img
                        src={currentAvatar}
                        alt="Avatar"
                      />
                    ) : (
                      <div className="myprofile-preview-fallback">
                        {currentProfile.name
                          ? currentProfile.name
                              .charAt(0)
                              .toUpperCase()
                          : "A"}
                      </div>
                    )}

                  </div>

                  <h3>
                    {currentProfile.name}
                  </h3>

                  <span className="myprofile-role-pill">
                    {currentProfile.role}
                  </span>

                  <div className="myprofile-preview-details">

                    <p>
                      <FiMail />
                      {currentProfile.email}
                    </p>

                    <p>
                      <FiPhone />
                      {currentProfile.phone}
                    </p>

                    <p>
                      <FiMapPin />
                      {currentProfile.address ||
                        "Address not added"}
                    </p>

                  </div>

                  <div className="myprofile-preview-footer">

                    <FiCalendar />

                    Member since{" "}
                    {currentProfile.created}

                  </div>

                </div>

              </div>

              {/* =================================================
                  ACCOUNT INFORMATION
              ================================================= */}

              <div className="myprofile-info-card">

                <h4>
                  Account Information
                </h4>

                <div className="myprofile-info-row">

                  <span>
                    <FiUser />
                    User ID
                  </span>

                  <span className="myprofile-info-val">
                    {currentProfile.id}
                  </span>

                </div>

                <div className="myprofile-info-row">

                  <span>
                    <FiCalendar />
                    Account Created
                  </span>

                  <span className="myprofile-info-val">
                    {currentProfile.created}
                  </span>

                </div>

                <div className="myprofile-info-row">

                  <span>
                    <FiClock />
                    Last Login
                  </span>

                  <span className="myprofile-info-val">
                    {currentProfile.lastLogin}
                  </span>

                </div>

                <div className="myprofile-info-row">

                  <span>
                    <FiShield />
                    Account Status
                  </span>

                  <span className="myprofile-badge-active">
                    {currentProfile.status}
                  </span>

                </div>

                <div className="myprofile-info-row">

                  <span>
                    <FiLock />
                    Two-Factor Authentication
                  </span>

                  <span
                    className={
                      preferences.twoFactor
                        ? "myprofile-badge-active"
                        : "myprofile-badge-disabled"
                    }
                  >
                    {preferences.twoFactor
                      ? "Enabled"
                      : "Disabled"}
                  </span>

                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* =====================================================
          CHANGE PASSWORD
      ===================================================== */}

      {activeTab === "Change Password" && (
        <div className="myprofile-tab-content-card">

          <h3>
            Change Password
          </h3>

          <p>
            Ensure your account is using a long,
            random password to stay secure.
          </p>

          <form
            onSubmit={handlePasswordUpdate}
            className="myprofile-password-form"
          >

            <div className="myprofile-form-group">

              <label>
                Current Password *
              </label>

              <input
                type="password"
                value={passwordData.current}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    current:
                      e.target.value,
                  })
                }
                required
              />

            </div>

            <div className="myprofile-form-group">

              <label>
                New Password *
              </label>

              <input
                type="password"
                value={passwordData.newPass}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPass:
                      e.target.value,
                  })
                }
                required
              />

            </div>

            <div className="myprofile-form-group">

              <label>
                Confirm New Password *
              </label>

              <input
                type="password"
                value={passwordData.confirm}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirm:
                      e.target.value,
                  })
                }
                required
              />

            </div>

            <button
              type="submit"
              className="myprofile-submit-btn"
              disabled={passwordSaving}
            >
              {passwordSaving
                ? "Updating Password..."
                : "Update Password"}
            </button>

          </form>

        </div>
      )}

      {/* =====================================================
          ACCOUNT PREFERENCES
      ===================================================== */}

      {activeTab === "Account Preferences" && (
        <div className="myprofile-tab-content-card">

          <h3>
            Account Preferences
          </h3>

          <p>
            Manage your notification settings
            and display options.
          </p>

          <div className="myprofile-preferences-list">

            <label className="myprofile-checkbox-label">

              <input
                type="checkbox"
                checked={
                  preferences.emailNotif
                }
                onChange={() =>
                  handlePreferenceChange(
                    "emailNotif"
                  )
                }
              />

              Receive Email Notifications
              for system updates

            </label>

            <label className="myprofile-checkbox-label">

              <input
                type="checkbox"
                checked={
                  preferences.smsNotif
                }
                onChange={() =>
                  handlePreferenceChange(
                    "smsNotif"
                  )
                }
              />

              Receive SMS Alerts for
              booking activities

            </label>

            <label className="myprofile-checkbox-label">

              <input
                type="checkbox"
                checked={
                  preferences.darkMode
                }
                onChange={() =>
                  handlePreferenceChange(
                    "darkMode"
                  )
                }
              />

              Enable Dark Mode Theme
              interface

            </label>

            <label className="myprofile-checkbox-label">

              <input
                type="checkbox"
                checked={
                  preferences.twoFactor
                }
                onChange={() =>
                  handlePreferenceChange(
                    "twoFactor"
                  )
                }
              />

              Require Two-Factor
              Authentication on login

            </label>

          </div>

          <button
            className="myprofile-submit-btn"
            onClick={
              handlePreferencesUpdate
            }
            disabled={preferencesSaving}
          >
            {preferencesSaving
              ? "Saving Preferences..."
              : "Save Preferences"}
          </button>

        </div>
      )}

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <div className="myprofile-quick-actions-card">

        <h4>
          Quick Actions
        </h4>

        <p>
          Manage your account security and
          preferences
        </p>

        <div className="myprofile-quick-grid">

          <div
            className="myprofile-quick-item"
            onClick={() =>
              setActiveTab(
                "Change Password"
              )
            }
          >

            <div className="myprofile-quick-icon">
              <FiLock />
            </div>

            <div>
              <h5>
                Change Password
              </h5>

              <p>
                Update your account password
              </p>
            </div>

            <FiArrowRight className="myprofile-arrow" />

          </div>

          <div
            className="myprofile-quick-item"
            onClick={() =>
              setShowSecuritySettings(true)
            }
          >

            <div className="myprofile-quick-icon">
              <FiShield />
            </div>

            <div>
              <h5>
                Security Settings
              </h5>

              <p>
                Manage 2FA and login security
              </p>
            </div>

            <FiArrowRight className="myprofile-arrow" />

          </div>

          <div
            className="myprofile-quick-item"
            onClick={() =>
              setShowLoginActivity(true)
            }
          >

            <div className="myprofile-quick-icon">
              <FiClock />
            </div>

            <div>
              <h5>
                Login Activity
              </h5>

              <p>
                View recent login sessions
              </p>
            </div>

            <FiArrowRight className="myprofile-arrow" />

          </div>

        </div>

      </div>

      {/* =====================================================
          SECURITY MODAL
      ===================================================== */}

      {showSecuritySettings && (
        <div
          className="myprofile-modal-overlay"
          onClick={() =>
            setShowSecuritySettings(false)
          }
        >

          <div
            className="myprofile-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="myprofile-modal-header">

              <h3>
                Security Settings
              </h3>

              <button
                onClick={() =>
                  setShowSecuritySettings(
                    false
                  )
                }
              >
                <FiX />
              </button>

            </div>

            <div className="myprofile-modal-form">

              <p>
                Two-Factor Authentication is{" "}
                <strong>
                  {preferences.twoFactor
                    ? "Enabled"
                    : "Disabled"}
                </strong>
                .
              </p>

              <button
                type="button"
                className="myprofile-modal-save-btn"
                onClick={async () => {

                  const updated = {
                    ...preferences,
                    twoFactor:
                      !preferences.twoFactor,
                  };

                  try {

                    const res =
                      await API.put(
                        "/auth/preferences",
                        updated
                      );

                    if (
                      res.data?.preferences
                    ) {
                      setPreferences(
                        res.data.preferences
                      );
                    }

                    alert(
                      "Security settings updated successfully!"
                    );

                    setShowSecuritySettings(
                      false
                    );

                  } catch (err) {

                    console.error(
                      "Failed to update security settings:",
                      err
                    );

                    alert(
                      err.response?.data
                        ?.message ||
                        "Failed to update security settings."
                    );
                  }

                }}
              >
                {preferences.twoFactor
                  ? "Disable Two-Factor Authentication"
                  : "Enable Two-Factor Authentication"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          LOGIN ACTIVITY MODAL
      ===================================================== */}

      {showLoginActivity && (
        <div
          className="myprofile-modal-overlay"
          onClick={() =>
            setShowLoginActivity(false)
          }
        >

          <div
            className="myprofile-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="myprofile-modal-header">

              <h3>
                Login Activity
              </h3>

              <button
                onClick={() =>
                  setShowLoginActivity(false)
                }
              >
                <FiX />
              </button>

            </div>

            <div className="myprofile-modal-form">

              {loginActivity.length === 0 ? (
                <p>
                  No login activity found.
                </p>
              ) : (
                loginActivity.map(
                  (activity, index) => (
                    <div
                      key={
                        activity._id ||
                        index
                      }
                      style={{
                        padding:
                          "12px 0",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >

                      <strong>
                        Login {index + 1}
                      </strong>

                      <p>
                        <FiCalendar />{" "}
                        {formatDate(
                          activity.loginAt
                        )}
                      </p>

                      <p>
                        IP:{" "}
                        {activity.ipAddress ||
                          "Unknown"}
                      </p>

                    </div>
                  )
                )
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default MyProfile;