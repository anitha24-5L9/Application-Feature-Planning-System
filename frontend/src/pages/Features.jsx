import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import AddFlagForm from "../components/AddFlagForm";
import FlagTable from "../components/FlagTable";
import FlagModal from "../components/FlagModal";

import {
  getFlags,
  createFlag,
  updateFlag,
} from "../services/api";

import "../styles/flag.css";

function Features() {
  const [searchParams] = useSearchParams();

  const action = searchParams.get("action");

  const [flags, setFlags] = useState([]);
  const [open, setOpen] = useState(action === "create");
  const [editFlag, setEditFlag] = useState(null);

  useEffect(() => {
    loadFlags();
  }, []);

  async function loadFlags() {
    console.log("loadFlags() called");

    try {
      const data = await getFlags();

      console.log("Received data:", data);

      setFlags(data);
    } catch (error) {
      console.error("Error while loading flags:", error);
    }
  }

  async function handleAdd(flag) {
    try {
      await createFlag(flag);

      await loadFlags();

      setOpen(false);
    } catch (error) {
      console.error("Create feature failed:", error);

      alert(error.message);
    }
  }

  async function handleUpdate(flag) {
    try {
      await updateFlag(flag.key, {
        type: flag.type,
        default_value: flag.default_value,
        enabled: flag.enabled,
        description: flag.description,
        owner_team: flag.owner_team,
      });

      await loadFlags();

      setEditFlag(null);
      setOpen(false);
    } catch (error) {
      console.error("Update feature failed:", error);

      alert(error.message);
    }
  }

  function handleEdit(flag) {
    setEditFlag(flag);
    setOpen(true);
  }

  function handleCreate() {
    setEditFlag(null);
    setOpen(true);
  }

  const enabled = flags.filter((flag) => flag.enabled).length;
  const disabled = flags.length - enabled;

  const teams = new Set(
    flags
      .map((flag) => flag.owner_team)
      .filter(Boolean)
  ).size;

  return (
    <div className="feature-page">

      {/* ================================
          PAGE HEADER
      ================================= */}

      <div className="feature-header">

        <div className="page-header">
          <h1>Feature Flags</h1>

          <p>
            Manage all feature flags
          </p>
        </div>

        {/* CREATE BUTTON - TOP RIGHT */}

        <button
          type="button"
          className="create-feature-btn"
          onClick={handleCreate}
        >
          <span className="create-icon">＋</span>
          Create Feature
        </button>

      </div>


      {/* ================================
          STATISTICS
      ================================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <h2>{flags.length}</h2>
          <span>Total Flags</span>
        </div>

        <div className="stat-card">
          <h2>{enabled}</h2>
          <span>Enabled</span>
        </div>

        <div className="stat-card">
          <h2>{disabled}</h2>
          <span>Disabled</span>
        </div>

        <div className="stat-card">
          <h2>{teams}</h2>
          <span>Teams</span>
        </div>

      </div>


      {/* ================================
          FEATURE FLAG TABLE
      ================================= */}

      <div className="feature-table-card">

        <div className="table-header">

          <div>
            <h2>Feature Flags</h2>

            <p>
              Manage and monitor your application features.
            </p>
          </div>

          <span className="flag-count">
            {flags.length} Flags
          </span>

        </div>

        <FlagTable
          flags={flags}
          onEdit={handleEdit}
        />

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