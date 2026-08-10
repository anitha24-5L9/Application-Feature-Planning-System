import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useEnvironment,
} from "../context/EnvironmentContext";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  ThemeContext,
} from "../context/ThemeContext";

import { getFlags } from "../services/api";

import "../styles/navbar.css";


export default function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();


  // ========================================
  // Environment
  // ========================================

  const {
    environment,
    setEnvironment,
    environments,
  } = useEnvironment();


  // ========================================
  // Other Contexts
  // ========================================

  const { user, logout } =
    useContext(AuthContext);

  const { theme, toggleTheme } =
    useContext(ThemeContext);


  // ========================================
  // Local State
  // ========================================

  const [openProfile, setOpenProfile] =
    useState(false);

  const [openEnvironment, setOpenEnvironment] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [flags, setFlags] =
    useState([]);

  const [showResults, setShowResults] =
    useState(false);


  // ========================================
  // Refs
  // ========================================

  const profileRef =
    useRef(null);

  const searchRef =
    useRef(null);

  const environmentRef =
    useRef(null);


  // ========================================
  // Load Feature Flags
  // ========================================

  useEffect(() => {

    async function loadSearchData() {

      try {

        const data =
          await getFlags();

        setFlags(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Failed to load search data:",
          error
        );

      }

    }

    loadSearchData();

  }, [location.pathname]);


  // ========================================
  // Close Dropdowns Outside Click
  // ========================================

  useEffect(() => {

    function handleOutsideClick(event) {

      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setOpenProfile(false);
      }


      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target
        )
      ) {
        setShowResults(false);
      }


      if (
        environmentRef.current &&
        !environmentRef.current.contains(
          event.target
        )
      ) {
        setOpenEnvironment(false);
      }

    }


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  // ========================================
  // Search Filtering
  // ========================================

  const filteredFlags =
    search.trim().length === 0
      ? []
      : flags
          .filter((flag) => {

            const query =
              search
                .toLowerCase()
                .trim();


            return (

              flag.key
                ?.toLowerCase()
                .includes(query)

              ||

              flag.description
                ?.toLowerCase()
                .includes(query)

              ||

              flag.owner_team
                ?.toLowerCase()
                .includes(query)

            );

          })
          .slice(0, 6);


  // ========================================
  // Open Feature
  // ========================================

  function openFeature(flag) {

    setSearch("");
    setShowResults(false);

    navigate(
      `/flags/${encodeURIComponent(
        flag.key
      )}`
    );

  }


  // ========================================
  // Search Submit
  // ========================================

  function handleSearchSubmit(event) {

    event.preventDefault();


    if (!search.trim()) {
      return;
    }


    if (filteredFlags.length > 0) {

      openFeature(
        filteredFlags[0]
      );

      return;

    }


    navigate(
      `/features?search=${encodeURIComponent(
        search.trim()
      )}`
    );


    setShowResults(false);

  }


  // ========================================
  // Environment Helpers
  // ========================================

  function getEnvironmentType(env) {

    const value =
      String(env || "")
        .toLowerCase()
        .trim();


    if (
      value.includes("all")
    ) {
      return "all";
    }


    if (
      value.includes("develop")
    ) {
      return "development";
    }


    if (
      value.includes("test")
    ) {
      return "testing";
    }


    if (
      value.includes("prod")
    ) {
      return "production";
    }


    if (
      value.includes("stag")
    ) {
      return "staging";
    }


    return "default";

  }


  function getEnvironmentIcon(env) {

    const type =
      getEnvironmentType(env);


    if (type === "all") {
      return "🌐";
    }

    return "●";

  }


  function handleEnvironmentChange(
    selectedEnvironment
  ) {

    setEnvironment(
      selectedEnvironment
    );

    setOpenEnvironment(false);

  }


  // ========================================
  // Logout
  // ========================================

  function handleLogout() {

    setOpenProfile(false);

    logout();

  }


  // ========================================
  // UI
  // ========================================

  return (

    <header className="navbar">


      {/* ==================================
          LEFT SIDE
      ================================== */}

      <div className="navbar-left">

        <button
          className="mobile-brand"
          onClick={() =>
            navigate("/")
          }
          type="button"
        >

          <span className="brand-icon">
            🚀
          </span>

          <span className="brand-text">
            FlagFlow
          </span>

        </button>


        <div className="nav-title-block">

          <span className="nav-title">
            Feature Governance
          </span>

          <span className="nav-subtitle">
            Control Center
          </span>

        </div>

      </div>


      {/* ==================================
          RIGHT SIDE
      ================================== */}

      <div className="nav-right">


        {/* ==================================
            SEARCH
        ================================== */}

        <div
          className="search-wrapper"
          ref={searchRef}
        >

          <form
            className="search-container"
            onSubmit={
              handleSearchSubmit
            }
          >

            <span className="search-icon">
              🔎
            </span>


            <input
              className="search-box"
              type="text"
              placeholder="Search features..."
              value={search}
              onChange={(event) => {

                setSearch(
                  event.target.value
                );

                setShowResults(true);

              }}
              onFocus={() => {

                if (search.trim()) {
                  setShowResults(true);
                }

              }}
              aria-label="Search features"
            />


            {search && (

              <button
                type="button"
                className="search-clear"
                onClick={() => {

                  setSearch("");
                  setShowResults(false);

                }}
              >
                ×
              </button>

            )}

          </form>


          {/* SEARCH RESULTS */}

          {showResults &&
            search.trim() &&
            filteredFlags.length > 0 && (

              <div className="search-results">

                <div className="search-results-header">

                  <span>
                    Feature Flags
                  </span>

                  <small>
                    {filteredFlags.length}
                  </small>

                </div>


                {filteredFlags.map(
                  (flag) => (

                    <button
                      key={flag.key}
                      type="button"
                      className="search-result-item"
                      onClick={() =>
                        openFeature(flag)
                      }
                    >

                      <div className="result-icon">
                        🚩
                      </div>


                      <div className="result-content">

                        <strong>
                          {flag.key}
                        </strong>

                        <span>
                          {flag.owner_team ||
                            "No owner"}
                        </span>

                      </div>


                      <span className="result-arrow">
                        →
                      </span>

                    </button>

                  )
                )}

              </div>

            )}


          {showResults &&
            search.trim() &&
            filteredFlags.length === 0 && (

              <div className="search-results empty-search">

                <div className="empty-search-icon">
                  🔍
                </div>

                <strong>
                  No features found
                </strong>

                <span>
                  Try another feature name
                </span>

              </div>

            )}

        </div>


        {/* ==================================
            ENVIRONMENT SWITCHER
        ================================== */}

        <div
          className="environment-switcher"
          ref={environmentRef}
        >

          <button
            type="button"
            className={`environment-trigger ${
              openEnvironment
                ? "open"
                : ""
            }`}
            onClick={() =>
              setOpenEnvironment(
                (prev) => !prev
              )
            }
            aria-haspopup="listbox"
            aria-expanded={
              openEnvironment
            }
          >

            <span className="environment-trigger-icon">
              {getEnvironmentIcon(
                environment
              )}
            </span>


            <span className="environment-trigger-text">

              {environment ||
                "All Environments"}

            </span>


            <span
              className={`environment-chevron ${
                openEnvironment
                  ? "rotate"
                  : ""
              }`}
            >
              ⌄
            </span>

          </button>


          {openEnvironment && (

            <div
              className="environment-dropdown"
              role="listbox"
            >

              {environments.map(
                (env, index) => {

                  const type =
                    getEnvironmentType(
                      env
                    );

                  const isSelected =
                    environment === env;


                  return (

                    <button
                      key={`${env}-${index}`}
                      type="button"
                      role="option"
                      aria-selected={
                        isSelected
                      }
                      className={`environment-option ${
                        isSelected
                          ? "selected"
                          : ""
                      } ${type}`}
                      onClick={() =>
                        handleEnvironmentChange(
                          env
                        )
                      }
                    >

                      <span
                        className={`environment-option-icon ${type}`}
                      >
                        {type === "all"
                          ? "🌐"
                          : "●"}
                      </span>


                      <span className="environment-option-text">
                        {env}
                      </span>


                      {isSelected && (
                        <span className="environment-check">
                          ✓
                        </span>
                      )}

                    </button>

                  );

                }
              )}

            </div>

          )}

        </div>


        {/* ==================================
            THEME
        ================================== */}

        <button
          className="theme-button"
          onClick={toggleTheme}
          type="button"
          title={
            theme === "light"
              ? "Switch to dark mode"
              : "Switch to light mode"
          }
          aria-label="Toggle theme"
        >

          <span>

            {theme === "light"
              ? "🌙"
              : "☀️"}

          </span>

        </button>


        {/* ==================================
            PROFILE
        ================================== */}

        <div
          className="user-section"
          ref={profileRef}
        >

          <button
            className="profile-circle"
            onClick={() =>
              setOpenProfile(
                !openProfile
              )
            }
            type="button"
            aria-label="Open profile"
          >

            {user?.name
              ? user.name
                  .charAt(0)
                  .toUpperCase()
              : "A"}

          </button>


          {openProfile && (

            <div className="profile-panel">

              <div className="profile-header">

                <div className="profile-avatar">

                  {user?.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "A"}

                </div>


                <div>

                  <h3>
                    {user?.name ||
                      "User"}
                  </h3>

                  <span className="profile-role">

                    {user?.role ||
                      "Developer"}

                  </span>

                </div>

              </div>


              <div className="profile-divider" />


              <div className="profile-info">

                <div className="profile-info-row">

                  <span>
                    ✉️
                  </span>

                  <div>

                    <small>
                      Email
                    </small>

                    <p>
                      {user?.email ||
                        "user@email.com"}
                    </p>

                  </div>

                </div>


                <div className="profile-info-row">

                  <span>
                    🌍
                  </span>

                  <div>

                    <small>
                      Environment
                    </small>

                    <p>
                      {environment}
                    </p>

                  </div>

                </div>

              </div>


              <button
                className="logout-button"
                onClick={handleLogout}
                type="button"
              >

                <span>
                  ↪
                </span>

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );

}