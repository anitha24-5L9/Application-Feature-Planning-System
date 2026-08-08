import { useState } from "react";
import "../styles/release.css";

function Releases() {
  const [showModal, setShowModal] = useState(false);

  const [releases, setReleases] = useState([
    {
      id: 1,
      version: "v1.4.0",
      title: "New Dashboard Experience",
      description:
        "Updated dashboard experience with improved analytics, navigation and performance.",
      status: "Released",
      date: "Aug 08, 2026",
      owner: "Admin Team",
      flags: 4,
    },
    {
      id: 2,
      version: "v1.3.0",
      title: "Feature Targeting",
      description:
        "Added user and group based targeting rules for feature flags.",
      status: "Released",
      date: "Aug 05, 2026",
      owner: "Platform Team",
      flags: 3,
    },
    {
      id: 3,
      version: "v1.2.0",
      title: "Environment Overrides",
      description:
        "Environment specific overrides are now available for feature flags.",
      status: "In Progress",
      date: "Aug 02, 2026",
      owner: "Engineering Team",
      flags: 5,
    },
  ]);

  const [newRelease, setNewRelease] = useState({
    version: "",
    title: "",
    description: "",
    status: "Planned",
    owner: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;

    setNewRelease((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCreateRelease(e) {
    e.preventDefault();

    if (
      !newRelease.version.trim() ||
      !newRelease.title.trim() ||
      !newRelease.description.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const release = {
      id: Date.now(),
      version: newRelease.version.trim(),
      title: newRelease.title.trim(),
      description: newRelease.description.trim(),
      status: newRelease.status,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      owner: newRelease.owner.trim() || "Admin Team",
      flags: 0,
    };

    setReleases((prev) => [release, ...prev]);

    setNewRelease({
      version: "",
      title: "",
      description: "",
      status: "Planned",
      owner: "",
    });

    setShowModal(false);
  }

  function handleDeleteRelease(id) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this release?"
    );

    if (!confirmed) return;

    setReleases((prev) =>
      prev.filter((release) => release.id !== id)
    );
  }

  const releasedCount = releases.filter(
    (release) => release.status === "Released"
  ).length;

  const inProgressCount = releases.filter(
    (release) => release.status === "In Progress"
  ).length;

  const plannedCount = releases.filter(
    (release) => release.status === "Planned"
  ).length;

  return (
    <div className="release-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="release-header">

        <div>
          <h1>🚀 Releases</h1>

          <p>
            Manage feature releases, rollout progress and
            deployment milestones.
          </p>
        </div>

        <button
          className="release-create-btn"
          onClick={() => setShowModal(true)}
        >
          <span>＋</span>
          Create Release
        </button>

      </div>


      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="release-summary">

        <div className="summary-card">

          <div className="summary-icon blue">
            🚀
          </div>

          <div>
            <span>Total Releases</span>
            <strong>{releases.length}</strong>
          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon green">
            ✓
          </div>

          <div>
            <span>Released</span>
            <strong>{releasedCount}</strong>
          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon orange">
            ◷
          </div>

          <div>
            <span>In Progress</span>
            <strong>{inProgressCount}</strong>
          </div>

        </div>


        <div className="summary-card">

          <div className="summary-icon purple">
            ◈
          </div>

          <div>
            <span>Planned</span>
            <strong>{plannedCount}</strong>
          </div>

        </div>

      </div>


      {/* =========================
          RELEASE SECTION
      ========================= */}

      <div className="release-section">

        <div className="release-section-header">

          <div>
            <h2>Release History</h2>

            <p>
              Track your feature releases and deployment activity.
            </p>
          </div>

          <span className="release-count">
            {releases.length} Releases
          </span>

        </div>


        {/* =========================
            EMPTY STATE
        ========================= */}

        {releases.length === 0 ? (

          <div className="release-empty">

            <div className="empty-icon">
              🚀
            </div>

            <h3>No releases yet</h3>

            <p>
              Create your first release to start tracking
              deployment activity.
            </p>

            <button
              className="empty-create-btn"
              onClick={() => setShowModal(true)}
            >
              Create First Release
            </button>

          </div>

        ) : (

          <div className="release-list">

            {releases.map((release) => (

              <div
                className="release-card"
                key={release.id}
              >

                {/* Timeline */}

                <div className="release-timeline">

                  <div className="timeline-dot">
                    🚀
                  </div>

                  <div className="timeline-line"></div>

                </div>


                {/* Main Content */}

                <div className="release-content">

                  <div className="release-card-top">

                    <div className="release-title-area">

                      <div className="version-badge">
                        {release.version}
                      </div>

                      <h3>
                        {release.title}
                      </h3>

                    </div>


                    <span
                      className={`release-status ${release.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      <span className="status-dot"></span>
                      {release.status}
                    </span>

                  </div>


                  <p className="release-description">
                    {release.description}
                  </p>


                  <div className="release-meta">

                    <div className="meta-item">
                      <span className="meta-label">
                        Released
                      </span>

                      <span className="meta-value">
                        📅 {release.date}
                      </span>
                    </div>


                    <div className="meta-item">
                      <span className="meta-label">
                        Owner
                      </span>

                      <span className="meta-value">
                        👤 {release.owner}
                      </span>
                    </div>


                    <div className="meta-item">
                      <span className="meta-label">
                        Feature Flags
                      </span>

                      <span className="meta-value">
                        🚩 {release.flags}
                      </span>
                    </div>

                  </div>


                  <div className="release-card-actions">

                    <button className="view-release-btn">
                      View Details
                    </button>

                    <button
                      className="delete-release-btn"
                      onClick={() =>
                        handleDeleteRelease(release.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* =========================
          CREATE RELEASE MODAL
      ========================= */}

      {showModal && (

        <div
          className="release-modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="release-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="release-modal-header">

              <div>
                <h2>Create Release</h2>

                <p>
                  Add a new release to your deployment history.
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>


            <form
              className="release-form"
              onSubmit={handleCreateRelease}
            >

              {/* Version */}

              <div className="form-group">

                <label>
                  Version
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="version"
                  placeholder="e.g. v1.5.0"
                  value={newRelease.version}
                  onChange={handleInputChange}
                />

              </div>


              {/* Title */}

              <div className="form-group">

                <label>
                  Release Title
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. New Dashboard Experience"
                  value={newRelease.title}
                  onChange={handleInputChange}
                />

              </div>


              {/* Description */}

              <div className="form-group">

                <label>
                  Description
                  <span>*</span>
                </label>

                <textarea
                  name="description"
                  placeholder="Describe what is included in this release..."
                  value={newRelease.description}
                  onChange={handleInputChange}
                  rows="4"
                />

              </div>


              {/* Status */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={newRelease.status}
                    onChange={handleInputChange}
                  >

                    <option value="Planned">
                      Planned
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Released">
                      Released
                    </option>

                  </select>

                </div>


                {/* Owner */}

                <div className="form-group">

                  <label>
                    Owner
                  </label>

                  <input
                    type="text"
                    name="owner"
                    placeholder="e.g. Platform Team"
                    value={newRelease.owner}
                    onChange={handleInputChange}
                  />

                </div>

              </div>


              {/* Modal Actions */}

              <div className="release-modal-actions">

                <button
                  type="button"
                  className="cancel-release-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-release-btn"
                >
                  🚀 Create Release
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Releases;