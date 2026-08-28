import React, { useEffect, useState, useRef } from "react";
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
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./MyProfile.css";
import API from "../../api/axios";

const initialProfilesData = [
  {
    id: 1,
    name: "Admin",
    email: "admin@drivex.com",
    phone: "+1 202-555-0182",
    role: "Super Admin",
    address:
      "123 DriveX Street, New York, NY 10001, USA",
    language: "English",
    timeZone:
      "(UTC-05:00) Eastern Time (US & Canada)",
    bio:
      "Administrator of DriveX car rental platform. Manage all operations and system settings.",
    status: "Active",
    created: "May 12, 2025, 10:30 AM",
    lastLogin: "May 18, 2025, 09:15 AM",
    avatar: null,
  },
];

const MyProfile = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("Profile Settings");

  const [profiles, setProfiles] =
    useState(initialProfilesData);

  const [currentProfile, setCurrentProfile] =
    useState(initialProfilesData[0]);

  const [formData, setFormData] = useState(
    initialProfilesData[0]
  );

  const [passwordData, setPasswordData] =
    useState({
      current: "",
      newPass: "",
      confirm: "",
    });

  const [preferences, setPreferences] =
    useState({
      emailNotif: true,
      smsNotif: false,
      darkMode: false,
      twoFactor: false,
    });

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [isRightPanelVisible, setIsRightPanelVisible] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [savingPassword, setSavingPassword] =
    useState(false);

  const [savingPreferences, setSavingPreferences] =
    useState(false);

  const [addingProfile, setAddingProfile] =
    useState(false);

  const [loginActivity, setLoginActivity] =
    useState([]);

  const [showLoginActivity, setShowLoginActivity] =
    useState(false);

  const [showSecuritySettings, setShowSecuritySettings] =
    useState(false);

  const [newProfile, setNewProfile] =
    useState({
      name: "",
      email: "",
      phone: "",
      role: "Super Admin",
    });

  const fileInputRef = useRef(null);

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

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

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await API.get("/auth/me");

      const admin = response.data?.admin;

      if (!admin) {
        throw new Error("Admin profile not found");
      }

      const latestLogin =
        admin.loginActivity &&
        admin.loginActivity.length > 0
          ? admin.loginActivity[0].loginAt
          : admin.updatedAt;

      const profileData = {
        id: admin._id || admin.id,
        name: admin.name || admin.username || "Admin",
        email: admin.email || "",
        phone: admin.phone || "",
        role: admin.role || "Super Admin",
        address: admin.address || "",
        language: admin.language || "English",
        timeZone:
          admin.timeZone ||
          "(UTC+05:30) India Standard Time",
        bio: admin.bio || "",
        status:
          admin.isActive === false
            ? "Inactive"
            : "Active",
        created: formatDate(admin.createdAt),
        lastLogin: formatDate(latestLogin),
        avatar: admin.avatar || null,
      };

      setCurrentProfile(profileData);
      setFormData(profileData);

      setPreferences({
        emailNotif:
          admin.preferences?.emailNotif ?? true,

        smsNotif:
          admin.preferences?.smsNotif ?? false,

        darkMode:
          admin.preferences?.darkMode ?? false,

        twoFactor:
          admin.preferences?.twoFactor ?? false,
      });

      setProfiles([profileData]);

      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          id: admin._id || admin.id,
          username: admin.username,
          name: admin.name || admin.username,
          email: admin.email || "",
          phone: admin.phone || "",
          role: admin.role || "Super Admin",
          avatar: admin.avatar || null,
        })
      );
    } catch (error) {
      console.error(
        "PROFILE FETCH ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminUser");

        navigate("/login", {
          replace: true,
        });
      } else {
        alert(
          error.response?.data?.message ||
            "Unable to load admin profile"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLoginActivity = async () => {
    try {
      const response = await API.get(
        "/auth/login-activity"
      );

      setLoginActivity(
        response.data?.activity || []
      );
    } catch (error) {
      console.error(
        "LOGIN ACTIVITY ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminUser");

        navigate("/login", {
          replace: true,
        });
      }
    }
  };

  useEffect(() => {
    loadProfile();
    loadLoginActivity();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      setSavingProfile(true);

      const response = await API.put(
        "/auth/profile",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          language: formData.language,
          timeZone: formData.timeZone,
          bio: formData.bio,
          avatar: formData.avatar,
        }
      );

      const admin =
        response.data?.admin;

      if (admin) {
        const updatedProfile = {
          id: admin._id || admin.id,
          name:
            admin.name ||
            admin.username ||
            formData.name,
          email:
            admin.email || formData.email,
          phone:
            admin.phone || formData.phone,
          role:
            admin.role || formData.role,
          address:
            admin.address || "",
          language:
            admin.language || "English",
          timeZone:
            admin.timeZone ||
            "(UTC+05:30) India Standard Time",
          bio: admin.bio || "",
          status:
            admin.isActive === false
              ? "Inactive"
              : "Active",
          created:
            formatDate(admin.createdAt) ||
            currentProfile.created,
          lastLogin:
            formatDate(
              admin.loginActivity?.[0]?.loginAt
            ) ||
            currentProfile.lastLogin,
          avatar:
            admin.avatar ||
            formData.avatar ||
            null,
        };

        setCurrentProfile(updatedProfile);
        setFormData(updatedProfile);
        setProfiles([updatedProfile]);

        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            id: admin._id || admin.id,
            username: admin.username,
            name:
              admin.name ||
              admin.username,
            email: admin.email || "",
            phone: admin.phone || "",
            role:
              admin.role || "Super Admin",
            avatar: admin.avatar || null,
          })
        );
      }

      alert(
        response.data?.message ||
          "Profile updated successfully!"
      );
    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminUser");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

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
      alert("New passwords don't match!");

      return;
    }

    if (passwordData.newPass.length < 5) {
      alert(
        "New password must be at least 5 characters"
      );

      return;
    }

    try {
      setSavingPassword(true);

      const response = await API.put(
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

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminUser");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "PASSWORD UPDATE ERROR:",
        error
      );

      if (error.response?.status === 401) {
        const message =
          error.response?.data?.message ||
          "";

        if (
          message
            .toLowerCase()
            .includes("current password")
        ) {
          alert(message);
          return;
        }

        localStorage.removeItem(
          "adminToken"
        );
        localStorage.removeItem(
          "adminAuth"
        );
        localStorage.removeItem(
          "adminUser"
        );

        navigate("/login", {
          replace: true,
        });

        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(
        "Image size must be less than 2MB."
      );

      e.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only JPG, PNG or WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const image = reader.result;

      setFormData((prev) => ({
        ...prev,
        avatar: image,
      }));

      setCurrentProfile((prev) => ({
        ...prev,
        avatar: image,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handlePreferenceChange = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePreferencesUpdate = async () => {
    try {
      setSavingPreferences(true);

      const response = await API.put(
        "/auth/preferences",
        preferences
      );

      if (response.data?.preferences) {
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
        "PREFERENCES UPDATE ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminUser");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to save preferences"
      );
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleSecuritySettings = () => {
    setShowSecuritySettings(
      (prev) => !prev
    );
  };

  const handleLoginActivity = async () => {
    await loadLoginActivity();

    setShowLoginActivity(
      (prev) => !prev
    );
  };

  const handleNewProfileChange = (e) => {
    const { name, value } = e.target;

    setNewProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProfile = async (e) => {
    e.preventDefault();

    if (
      !newProfile.name.trim() ||
      !newProfile.email.trim() ||
      !newProfile.phone.trim() ||
      !newProfile.role
    ) {
      alert(
        "Please fill all profile fields."
      );

      return;
    }

    try {
      setAddingProfile(true);

      const response = await API.post(
        "/auth/profiles",
        {
          name: newProfile.name.trim(),
          email:
            newProfile.email
              .trim()
              .toLowerCase(),
          phone: newProfile.phone.trim(),
          role: newProfile.role,
        }
      );

      const createdProfile =
        response.data?.profile;

      if (createdProfile) {
        const profile = {
          id:
            createdProfile._id ||
            createdProfile.id,

          name:
            createdProfile.name ||
            newProfile.name,

          email:
            createdProfile.email ||
            newProfile.email,

          phone:
            createdProfile.phone ||
            newProfile.phone,

          role:
            createdProfile.role ||
            newProfile.role,

          address:
            createdProfile.address || "",

          language:
            createdProfile.language ||
            "English",

          timeZone:
            createdProfile.timeZone ||
            "(UTC+05:30) India Standard Time",

          bio:
            createdProfile.bio || "",

          status:
            createdProfile.isActive === false
              ? "Inactive"
              : "Active",

          created:
            formatDate(
              createdProfile.createdAt
            ),

          lastLogin: "",

          avatar:
            createdProfile.avatar || null,
        };

        setProfiles((prev) => [
          ...prev,
          profile,
        ]);
      }

      alert(
        response.data?.message ||
          "New profile added successfully!"
      );

      setNewProfile({
        name: "",
        email: "",
        phone: "",
        role: "Super Admin",
      });

      setShowAddModal(false);
    } catch (error) {
      console.error(
        "ADD PROFILE ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminUser");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to add new profile"
      );
    } finally {
      setAddingProfile(false);
    }
  };

  const filteredProfiles =
    profiles.filter((profile) => {
      const query =
        searchQuery.trim().toLowerCase();

      if (!query) {
        return true;
      }

      return (
        profile.name
          ?.toLowerCase()
          .includes(query) ||
        profile.email
          ?.toLowerCase()
          .includes(query) ||
        profile.phone
          ?.toLowerCase()
          .includes(query) ||
        profile.role
          ?.toLowerCase()
          .includes(query)
      );
    });

  if (loading) {
    return (
      <div className="myprofile-container">
        <div className="myprofile-header-wrapper">
          <div className="myprofile-title-group">
            <h1 className="myprofile-title">
              Settings
            </h1>

            <p className="myprofile-subtitle">
              Manage your profile and account
              security
            </p>
          </div>
        </div>

        <div className="myprofile-tab-content-card">
          <h3>Loading Profile...</h3>
          <p>
            Please wait while your account
            information is loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="myprofile-container">

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

          <button
            className="myprofile-add-btn"
            onClick={() =>
              setShowAddModal(true)
            }
          >
            <FiPlus /> Add New Profile
          </button>

        </div>

      </div>

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
            {tab.icon} {tab.name}
          </button>

        ))}

      </div>

      {activeTab === "Profile Settings" && (

        <div
          className={`myprofile-main-grid ${
            !isRightPanelVisible
              ? "single-column"
              : ""
          }`}
        >

          <div className="myprofile-form-card">

            <div className="myprofile-card-header">

              <h3>Profile Information</h3>

              <p>
                Update your personal information
                and profile details
              </p>

            </div>

            <form
              onSubmit={handleProfileUpdate}
              className="myprofile-form"
            >

              <div className="myprofile-avatar-upload-section">

                <div className="myprofile-avatar-preview">

                  {formData.avatar ? (

                    <img
                      src={formData.avatar}
                      alt="Avatar"
                      className="myprofile-avatar-img"
                    />

                  ) : (

                    <div className="myprofile-avatar-fallback">
                      {formData.name
                        ? formData.name.charAt(0)
                        : "A"}
                    </div>

                  )}

                  <button
                    type="button"
                    className="myprofile-camera-btn"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    <FiCamera />
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/png, image/jpeg, image/webp"
                    style={{
                      display: "none",
                    }}
                  />

                </div>

                <span className="myprofile-upload-hint">
                  JPG, PNG or WEBP. Max size 2MB.
                </span>

              </div>

              <div className="myprofile-form-row">

                <div className="myprofile-form-group">

                  <label>Full Name *</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />

                </div>

                <div className="myprofile-form-group">

                  <label>Email Address *</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />

                </div>

              </div>

              <div className="myprofile-form-row">

                <div className="myprofile-form-group">

                  <label>Phone Number *</label>

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
                      onChange={handleInputChange}
                      required
                    />

                  </div>

                </div>

                <div className="myprofile-form-group">

                  <label>Role</label>

                  <input
                    type="text"
                    value={formData.role}
                    disabled
                    className="myprofile-disabled-input"
                  />

                </div>

              </div>

              <div className="myprofile-form-group">

                <label>Address</label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />

              </div>

              <div className="myprofile-form-row">

                <div className="myprofile-form-group">

                  <label>Language</label>

                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
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
                  </select>

                </div>

                <div className="myprofile-form-group">

                  <label>Time Zone</label>

                  <select
                    name="timeZone"
                    value={formData.timeZone}
                    onChange={handleInputChange}
                  >
                    <option value="(UTC-05:00) Eastern Time (US & Canada)">
                      (UTC-05:00) Eastern Time
                      (US & Canada)
                    </option>

                    <option value="(UTC-08:00) Pacific Time (US & Canada)">
                      (UTC-08:00) Pacific Time
                      (US & Canada)
                    </option>

                    <option value="(UTC+00:00) Greenwich Mean Time">
                      (UTC+00:00) Greenwich Mean
                      Time
                    </option>

                    <option value="(UTC+05:30) India Standard Time">
                      (UTC+05:30) India Standard
                      Time
                    </option>
                  </select>

                </div>

              </div>

              <div className="myprofile-form-group">

                <label>Bio</label>

                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleInputChange}
                ></textarea>

              </div>

              <button
                type="submit"
                className="myprofile-submit-btn"
                disabled={savingProfile}
              >
                {savingProfile
                  ? "Updating..."
                  : "Update Profile"}
              </button>

            </form>

          </div>

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

              <div className="myprofile-preview-card">

                <h4>Profile Preview</h4>

                <p className="myprofile-preview-sub">
                  This is how your profile appears
                </p>

                <div className="myprofile-preview-box">

                  <div className="myprofile-preview-avatar">

                    {currentProfile.avatar ? (

                      <img
                        src={currentProfile.avatar}
                        alt="Avatar"
                      />

                    ) : (

                      <div className="myprofile-preview-fallback">
                        {currentProfile.name
                          ? currentProfile.name.charAt(0)
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
                      <FiMail />{" "}
                      {currentProfile.email}
                    </p>

                    <p>
                      <FiPhone />{" "}
                      {currentProfile.phone}
                    </p>

                    <p>
                      <FiMapPin />{" "}
                      {currentProfile.address ||
                        "Address not added"}
                    </p>

                  </div>

                  <div className="myprofile-preview-footer">

                    <FiCalendar /> Member since{" "}
                    {currentProfile.created ||
                      "N/A"}

                  </div>

                </div>

              </div>

              <div className="myprofile-info-card">

                <h4>Account Information</h4>

                <div className="myprofile-info-row">

                  <span>
                    <FiUser /> User ID
                  </span>

                  <span className="myprofile-info-val">
                    {currentProfile.id ||
                      "DRVX-ADM-001"}
                  </span>

                </div>

                <div className="myprofile-info-row">

                  <span>
                    <FiCalendar /> Account Created
                  </span>

                  <span className="myprofile-info-val">
                    {currentProfile.created ||
                      "N/A"}
                  </span>

                </div>

                <div className="myprofile-info-row">

                  <span>
                    <FiClock /> Last Login
                  </span>

                  <span className="myprofile-info-val">
                    {currentProfile.lastLogin ||
                      "N/A"}
                  </span>

                </div>

                <div className="myprofile-info-row">

                  <span>
                    <FiShield /> Account Status
                  </span>

                  <span className="myprofile-badge-active">
                    {currentProfile.status ||
                      "Active"}
                  </span>

                </div>

                <div className="myprofile-info-row">

                  <span>
                    <FiLock /> Two-Factor Authentication
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

      {activeTab === "Change Password" && (

        <div className="myprofile-tab-content-card">

          <h3>Change Password</h3>

          <p>
            Ensure your account is using a long,
            random password to stay secure.
          </p>

          <form
            onSubmit={handlePasswordUpdate}
            className="myprofile-password-form"
          >

            <div className="myprofile-form-group">

              <label>Current Password *</label>

              <input
                type="password"
                value={passwordData.current}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    current: e.target.value,
                  })
                }
                required
              />

            </div>

            <div className="myprofile-form-group">

              <label>New Password *</label>

              <input
                type="password"
                value={passwordData.newPass}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPass: e.target.value,
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
                    confirm: e.target.value,
                  })
                }
                required
              />

            </div>

            <button
              type="submit"
              className="myprofile-submit-btn"
              disabled={savingPassword}
            >
              {savingPassword
                ? "Updating..."
                : "Update Password"}
            </button>

          </form>

        </div>

      )}

      {activeTab === "Account Preferences" && (

        <div className="myprofile-tab-content-card">

          <h3>Account Preferences</h3>

          <p>
            Manage your notification settings and
            display options.
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

              Receive Email Notifications for
              system updates

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

              Receive SMS Alerts for booking
              activities

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

              Enable Dark Mode Theme interface

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

              Require Two-Factor Authentication
              on login

            </label>

          </div>

          <button
            className="myprofile-submit-btn"
            onClick={
              handlePreferencesUpdate
            }
            disabled={savingPreferences}
          >
            {savingPreferences
              ? "Saving..."
              : "Save Preferences"}
          </button>

        </div>

      )}

      <div className="myprofile-quick-actions-card">

        <h4>Quick Actions</h4>

        <p>
          Manage your account security and
          preferences
        </p>

        <div className="myprofile-quick-grid">

          <div
            className="myprofile-quick-item"
            onClick={() =>
              setActiveTab("Change Password")
            }
          >

            <div className="myprofile-quick-icon">
              <FiLock />
            </div>

            <div>

              <h5>Change Password</h5>

              <p>
                Update your account password
              </p>

            </div>

            <FiArrowRight className="myprofile-arrow" />

          </div>

          <div
            className="myprofile-quick-item"
            onClick={
              handleSecuritySettings
            }
          >

            <div className="myprofile-quick-icon">
              <FiShield />
            </div>

            <div>

              <h5>Security Settings</h5>

              <p>
                Manage 2FA and login security
              </p>

            </div>

            <FiArrowRight className="myprofile-arrow" />

          </div>

          <div
            className="myprofile-quick-item"
            onClick={
              handleLoginActivity
            }
          >

            <div className="myprofile-quick-icon">
              <FiClock />
            </div>

            <div>

              <h5>Login Activity</h5>

              <p>
                View recent login sessions
              </p>

            </div>

            <FiArrowRight className="myprofile-arrow" />

          </div>

        </div>

      </div>

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

              <h3>Security Settings</h3>

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
                  const nextValue =
                    !preferences.twoFactor;

                  try {
                    setSavingPreferences(true);

                    const updated = {
                      ...preferences,
                      twoFactor: nextValue,
                    };

                    const response =
                      await API.put(
                        "/auth/preferences",
                        updated
                      );

                    setPreferences(
                      response.data
                        ?.preferences ||
                        updated
                    );

                    alert(
                      response.data
                        ?.message ||
                        "Security settings updated successfully!"
                    );
                  } catch (error) {
                    console.error(
                      "SECURITY UPDATE ERROR:",
                      error
                    );

                    alert(
                      error.response?.data
                        ?.message ||
                        "Failed to update security settings"
                    );
                  } finally {
                    setSavingPreferences(
                      false
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

              <h3>Login Activity</h3>

              <button
                onClick={() =>
                  setShowLoginActivity(
                    false
                  )
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
                        Login{" "}
                        {index + 1}
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

      {showAddModal && (

        <div
          className="myprofile-modal-overlay"
          onClick={() =>
            setShowAddModal(false)
          }
        >

          <div
            className="myprofile-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="myprofile-modal-header">

              <h3>Add New Profile</h3>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                <FiX />
              </button>

            </div>

            <form
              onSubmit={handleAddProfile}
              className="myprofile-modal-form"
            >

              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={newProfile.name}
                onChange={
                  handleNewProfileChange
                }
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={newProfile.email}
                onChange={
                  handleNewProfileChange
                }
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number *"
                value={newProfile.phone}
                onChange={
                  handleNewProfileChange
                }
                required
              />

              <select
                name="role"
                value={newProfile.role}
                onChange={
                  handleNewProfileChange
                }
              >

                <option value="Super Admin">
                  Super Admin
                </option>

                <option value="Manager">
                  Manager
                </option>

                <option value="Support Agent">
                  Support Agent
                </option>

              </select>

              <div className="myprofile-modal-actions">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  disabled={addingProfile}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="myprofile-modal-save-btn"
                  disabled={addingProfile}
                >
                  {addingProfile
                    ? "Saving..."
                    : "Save Profile"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default MyProfile;