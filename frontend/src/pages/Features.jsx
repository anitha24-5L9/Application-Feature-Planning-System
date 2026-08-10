import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  useEnvironment,
} from "../context/EnvironmentContext";

import AddFlagForm from "../components/AddFlagForm";
import FlagTable from "../components/FlagTable";
import FlagModal from "../components/FlagModal";

import {
  getFlags,
  createFlag,
  updateFlag,
  deleteFlag,
} from "../services/api";

import "../styles/flag.css";


function Features() {

  const [searchParams] =
    useSearchParams();

  const action =
    searchParams.get("action");

  const {
    environment,
  } = useEnvironment();

  const [flags, setFlags] =
    useState([]);

  const [open, setOpen] =
    useState(action === "create");

  const [editFlag, setEditFlag] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // ========================================
  // Load flags whenever environment changes
  // ========================================

  useEffect(() => {
    loadFlags();
  }, [environment]);


  async function loadFlags() {

    console.log(
      "Loading flags for environment:",
      environment
    );

    setLoading(true);

    try {

      const data = await getFlags();

      console.log(
        "All flags received:",
        data
      );

      const allFlags =
        Array.isArray(data)
          ? data
          : [];


      // ====================================
      // Environment filtering
      // ====================================

      const environmentFlags =
        allFlags.filter((flag) => {

          if (!flag.environment) {
            return true;
          }

          return (
            String(flag.environment)
              .toLowerCase() ===
            environment.toLowerCase()
          );

        });


      console.log(
        `Flags for ${environment}:`,
        environmentFlags
      );


      setFlags(
        environmentFlags
      );


    } catch (error) {

      console.error(
        "Error while loading flags:",
        error
      );

      setFlags([]);


    } finally {

      setLoading(false);

    }
  }


  // ========================================
  // Create Flag
  // ========================================

  async function handleAdd(flag) {

    try {

      await createFlag({
        ...flag,
        environment,
      });

      await loadFlags();

      setOpen(false);


    } catch (error) {

      console.error(
        "Create feature failed:",
        error
      );

      alert(error.message);

    }
  }


  // ========================================
  // Update Flag
  // ========================================

  async function handleUpdate(flag) {

    try {

      await updateFlag(
        flag.key,
        {
          type: flag.type,
          default_value:
            flag.default_value,
          enabled: flag.enabled,
          description:
            flag.description,
          owner_team:
            flag.owner_team,
          environment,
        }
      );

      await loadFlags();

      setEditFlag(null);
      setOpen(false);


    } catch (error) {

      console.error(
        "Update feature failed:",
        error
      );

      alert(error.message);

    }
  }


  // ========================================
  // Delete Flag
  // ========================================

  async function handleDelete(flag) {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete the feature flag "${flag.key}"?`
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteFlag(flag.key);

      await loadFlags();

    } catch (error) {

      console.error(
        "Delete feature failed:",
        error
      );

      alert(error.message);

    }
  }


  // ========================================
  // Edit
  // ========================================

  function handleEdit(flag) {

    setEditFlag(flag);
    setOpen(true);

  }


  // ========================================
  // Create
  // ========================================

  function handleCreate() {

    setEditFlag(null);
    setOpen(true);

  }


  // ========================================
  // Statistics
  // ========================================

  const enabled =
    flags.filter(
      (flag) => flag.enabled
    ).length;


  const disabled =
    flags.length - enabled;


  const teams =
    new Set(
      flags
        .map(
          (flag) =>
            flag.owner_team
        )
        .filter(Boolean)
    ).size;


  // ========================================
  // UI
  // ========================================

  return (

    <div>

      {/* ================================
          PAGE HEADER
      ================================= */}

      <div className="feature-header">

        <div className="page-header">

          <h1>
            Feature Flags
          </h1>

          <p>
            Manage feature flags for{" "}
            <strong>
              {environment}
            </strong>{" "}
            environment
          </p>

        </div>


        <button
          type="button"
          className="create-feature-btn"
          onClick={handleCreate}
        >

          <span className="create-icon">
            ＋
          </span>

          Create Feature

        </button>

      </div>


      {/* ================================
          ENVIRONMENT INFO
      ================================= */}

      <div className="environment-page-info">

        <span>
          🌍
        </span>

        <span>
          Showing flags for
        </span>

        <strong>
          {environment}
        </strong>

      </div>


      {/* ================================
          STATISTICS
      ================================= */}

      <div className="stats-grid">

        <div className="stat-card">

          <h2>
            {flags.length}
          </h2>

          <span>
            Total Flags
          </span>

        </div>


        <div className="stat-card">

          <h2>
            {enabled}
          </h2>

          <span>
            Enabled
          </span>

        </div>


        <div className="stat-card">

          <h2>
            {disabled}
          </h2>

          <span>
            Disabled
          </span>

        </div>


        <div className="stat-card">

          <h2>
            {teams}
          </h2>

          <span>
            Teams
          </span>

        </div>

      </div>


      {/* ================================
          FEATURE FLAG TABLE
      ================================= */}

      <div className="feature-table-card">

        <div className="table-header">

          <div>

            <h2>
              Feature Flags
            </h2>

            <p>
              Manage and monitor your{" "}
              {environment} feature flags.
            </p>

          </div>


          <span className="flag-count">

            {flags.length} Flags

          </span>

        </div>


        {loading ? (

          <div className="dashboard-loading">

            Loading {environment} flags...

          </div>

        ) : flags.length === 0 ? (

          <div className="dashboard-loading">

            No feature flags found in{" "}
            <strong>
              {environment}
            </strong>{" "}
            environment.

          </div>

        ) : (

          <FlagTable
            flags={flags}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        )}

      </div>


      {/* ================================
          CREATE / EDIT MODAL
      ================================= */}

      <FlagModal
        isOpen={open}
        onClose={() => {
          setEditFlag(null);
          setOpen(false);
        }}
      >

        <AddFlagForm
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          editFlag={editFlag}
          onCancel={() => {
            setEditFlag(null);
            setOpen(false);
          }}
        />

      </FlagModal>

    </div>
  );
}


export default Features;