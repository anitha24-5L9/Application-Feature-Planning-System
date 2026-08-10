import {
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  getSystemStatus,
  getFlags,
  changePassword,
} from "../services/api";

import "../styles/settings.css";


function Settings() {

  const [user, setUser] = useState(null);

  const [system, setSystem] = useState(null);

  const [flagCount, setFlagCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [savingPassword, setSavingPassword] = useState(false);

  // ==========================================
  // Toast State
  // ==========================================

  const [toast, setToast] = useState({
    visible: false,
    type: "",
    message: "",
  });


  const [error, setError] = useState("");


  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  // ==========================================
  // Show Toast
  // ==========================================

  function showToast(type, message) {

    setToast({
      visible: true,
      type,
      message,
    });

    // Automatically hide after 4 seconds
    setTimeout(() => {

      setToast({
        visible: false,
        type: "",
        message: "",
      });

    }, 4000);
  }


  // ==========================================
  // Load Settings Data
  // ==========================================

  useEffect(() => {

    loadSettings();

  }, []);


  async function loadSettings() {

    setLoading(true);

    setError("");

    try {

      const [
        userData,
        systemData,
        flagsData,
      ] = await Promise.all([
        getCurrentUser(),
        getSystemStatus(),
        getFlags(),
      ]);


      setUser(userData);

      setSystem(systemData);

      setFlagCount(
        Array.isArray(flagsData)
          ? flagsData.length
          : 0
      );

    } catch (err) {

      console.error(
        "Settings loading failed:",
        err
      );

      setError(
        err.message ||
        "Failed to load settings"
      );

    } finally {

      setLoading(false);

    }
  }


  // ==========================================
  // Form Change
  // ==========================================

  function handleChange(event) {

    const {
      name,
      value,
    } = event.target;


    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  }


  // ==========================================
  // Change Password
  // ==========================================

  async function handlePasswordChange(
    event
  ) {

    event.preventDefault();


    // Clear previous toast
    setToast({
      visible: false,
      type: "",
      message: "",
    });


    // ========================================
    // Validation
    // ========================================

    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmPassword
    ) {

      showToast(
        "error",
        "Please fill in all password fields."
      );

      return;
    }


    if (
      form.newPassword.length < 8
    ) {

      showToast(
        "error",
        "New password must contain at least 8 characters."
      );

      return;
    }


    if (
      form.newPassword !==
      form.confirmPassword
    ) {

      showToast(
        "error",
        "New password and confirm password do not match."
      );

      return;
    }


    // ========================================
    // Start API Request
    // ========================================

    setSavingPassword(true);


    try {

      await changePassword(
        form.currentPassword,
        form.newPassword
      );


      // ======================================
      // SUCCESS
      // ======================================

      showToast(
        "success",
        "Password changed successfully."
      );


      // Clear form after successful update
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });


    } catch (err) {

      console.error(
        "Password change failed:",
        err
      );


      // ======================================
      // ERROR
      // ======================================

      showToast(
        "error",
        err.message ||
        "Failed to change password."
      );


    } finally {

      setSavingPassword(false);

    }
  }


  // ==========================================
  // Loading
  // ==========================================

  if (loading) {

    return (
      <div className="settings-page">

        <div className="settings-loading">

          <div className="settings-spinner" />

          <span>
            Loading settings...
          </span>

        </div>

      </div>
    );

  }


  // ==========================================
  // Initial Error
  // ==========================================

  if (!user) {

    return (
      <div className="settings-page">

        <div className="settings-error-card">

          <div className="settings-error-icon">
            !
          </div>


          <h2>
            Unable to load settings
          </h2>


          <p>
            {error ||
              "Something went wrong while loading your profile."}
          </p>


          <button
            type="button"
            onClick={loadSettings}
            className="settings-retry-btn"
          >
            Try Again
          </button>

        </div>

      </div>
    );

  }


  // ==========================================
  // User Initials
  // ==========================================

  const initials =
    user.name
      ? user.name
          .split(" ")
          .map((part) =>
            part.charAt(0)
          )
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";


  return (

    <div className="settings-page">


      {/* ========================================
          GLOBAL TOAST NOTIFICATION
      ======================================== */}

      {toast.visible && (

        <div
          className={`settings-toast ${
            toast.type === "success"
              ? "toast-success"
              : "toast-error"
          }`}
        >

          <div className="toast-icon">

            {toast.type === "success"
              ? "✓"
              : "!"}

          </div>


          <div className="toast-content">

            <strong>

              {toast.type === "success"
                ? "Success"
                : "Update Failed"}

            </strong>


            <span>
              {toast.message}
            </span>

          </div>


          <button
            type="button"
            className="toast-close"
            onClick={() =>
              setToast({
                visible: false,
                type: "",
                message: "",
              })
            }
          >
            ×
          </button>

        </div>

      )}


      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="settings-header">

        <div>

          <div className="settings-title-row">

            <span className="settings-title-icon">
              ⚙️
            </span>


            <h1>
              Settings
            </h1>

          </div>


          <p>
            Manage your profile, security,
            and application status.
          </p>

        </div>

      </div>


      {/* ========================================
          PROFILE HERO
      ======================================== */}

      <div className="profile-hero">

        <div className="profile-avatar">
          {initials}
        </div>


        <div className="profile-hero-info">

          <h2>
            {user.name}
          </h2>


          <p>
            {user.email}
          </p>


          <div className="profile-role">

            <span className="role-dot" />

            {user.role || "Admin"}

          </div>

        </div>


        <div className="profile-account-badge">

          <span>
            ●
          </span>

          Account Active

        </div>

      </div>


      {/* ========================================
          MAIN GRID
      ======================================== */}

      <div className="settings-grid">


        {/* ======================================
            PROFILE DETAILS
        ====================================== */}

        <section className="settings-card profile-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              👤
            </div>


            <div>

              <h2>
                Profile Details
              </h2>


              <p>
                Your account information
              </p>

            </div>

          </div>


          <div className="profile-details">

            <div className="detail-item">

              <span className="detail-label">
                Full Name
              </span>


              <span className="detail-value">
                {user.name}
              </span>

            </div>


            <div className="detail-item">

              <span className="detail-label">
                User ID
              </span>


              <span className="detail-value user-id">
                #{user.id}
              </span>

            </div>


            <div className="detail-item">

              <span className="detail-label">
                Email Address
              </span>


              <span className="detail-value">
                {user.email}
              </span>

            </div>


            <div className="detail-item">

              <span className="detail-label">
                Role
              </span>


              <span className="admin-badge">
                {user.role || "Admin"}
              </span>

            </div>


            <div className="detail-item">

              <span className="detail-label">
                Account Created
              </span>


              <span className="detail-value">

                {user.created_at
                  ? new Date(
                      user.created_at
                    ).toLocaleDateString()
                  : "—"}

              </span>

            </div>

          </div>

        </section>


        {/* ======================================
            SYSTEM STATUS
        ====================================== */}

        <section className="settings-card system-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              🖥️
            </div>


            <div>

              <h2>
                System Status
              </h2>


              <p>
                Backend and database information
              </p>

            </div>

          </div>


          <div className="system-status-list">


            {/* Backend */}

            <div className="status-item">

              <div className="status-left">

                <div className="status-icon backend-icon">
                  ⚡
                </div>


                <div>

                  <strong>
                    Backend
                  </strong>


                  <span>
                    API service
                  </span>

                </div>

              </div>


              <div className="online-status">

                <span className="online-dot" />

                {system?.backend ||
                  "Unknown"}

              </div>

            </div>


            {/* Database */}

            <div className="status-item">

              <div className="status-left">

                <div className="status-icon database-icon">
                  🗄️
                </div>


                <div>

                  <strong>
                    Database
                  </strong>


                  <span>
                    Connection
                  </span>

                </div>

              </div>


              <div
                className={
                  system?.database ===
                  "Connected"
                    ? "online-status"
                    : "offline-status"
                }
              >

                <span
                  className={
                    system?.database ===
                    "Connected"
                      ? "online-dot"
                      : "offline-dot"
                  }
                />


                {system?.database ||
                  "Unknown"}

              </div>

            </div>


            {/* Database Type */}

            <div className="status-item">

              <div className="status-left">

                <div className="status-icon">
                  💾
                </div>


                <div>

                  <strong>
                    Database Type
                  </strong>


                  <span>
                    Storage engine
                  </span>

                </div>

              </div>


              <strong className="status-value">
                {system?.database_type ||
                  "Unknown"}
              </strong>

            </div>


            {/* Database Name */}

            <div className="status-item">

              <div className="status-left">

                <div className="status-icon">
                  📁
                </div>


                <div>

                  <strong>
                    Database
                  </strong>


                  <span>
                    Database file
                  </span>

                </div>

              </div>


              <strong className="status-value">
                {system?.database_name ||
                  "Unknown"}
              </strong>

            </div>


            {/* Feature Flags */}

            <div className="status-item">

              <div className="status-left">

                <div className="status-icon">
                  🚩
                </div>


                <div>

                  <strong>
                    Feature Flags
                  </strong>


                  <span>
                    Total flags
                  </span>

                </div>

              </div>


              <strong className="flag-total">
                {flagCount}
              </strong>

            </div>

          </div>

        </section>


        {/* ======================================
            CHANGE PASSWORD
        ====================================== */}

        <section className="settings-card password-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              🔐
            </div>


            <div>

              <h2>
                Change Password
              </h2>


              <p>
                Keep your account secure
              </p>

            </div>

          </div>


          <form
            className="password-form"
            onSubmit={
              handlePasswordChange
            }
          >


            {/* Current Password */}

            <div className="password-field">

              <label>
                Current Password
              </label>


              <input
                type="password"
                name="currentPassword"
                value={
                  form.currentPassword
                }
                onChange={handleChange}
                placeholder="Enter current password"
                autoComplete="current-password"
                disabled={savingPassword}
              />

            </div>


            {/* New Password */}

            <div className="password-field">

              <label>
                New Password
              </label>


              <input
                type="password"
                name="newPassword"
                value={
                  form.newPassword
                }
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                disabled={savingPassword}
              />

            </div>


            {/* Confirm Password */}

            <div className="password-field">

              <label>
                Confirm New Password
              </label>


              <input
                type="password"
                name="confirmPassword"
                value={
                  form.confirmPassword
                }
                onChange={handleChange}
                placeholder="Confirm your new password"
                autoComplete="new-password"
                disabled={savingPassword}
              />

            </div>


            {/* Footer */}

            <div className="password-footer">

              <span className="password-hint">
                🔒 Use at least 8 characters.
              </span>


              <button
                type="submit"
                className="change-password-btn"
                disabled={
                  savingPassword
                }
              >

                {savingPassword ? (
                  <>
                    <span className="button-spinner" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}

              </button>

            </div>

          </form>

        </section>


        {/* ======================================
            SECURITY INFO
        ====================================== */}

        <section className="settings-card security-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              🛡️
            </div>


            <div>

              <h2>
                Security
              </h2>


              <p>
                Account security information
              </p>

            </div>

          </div>


          <div className="security-content">


            <div className="security-row">

              <div>

                <strong>
                  Authentication
                </strong>


                <span>
                  JWT Bearer Authentication
                </span>

              </div>


              <span className="security-badge">
                Enabled
              </span>

            </div>


            <div className="security-row">

              <div>

                <strong>
                  Account Role
                </strong>


                <span>
                  {user.role || "Admin"} permissions
                </span>

              </div>


              <span className="security-badge">
                Active
              </span>

            </div>


            <div className="security-note">

              <span>
                🔒
              </span>


              <p>
                Your password is securely hashed
                before it is stored in the database.
              </p>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}


export default Settings;