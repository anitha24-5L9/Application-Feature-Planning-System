import "./../styles/flagDetail.css";
import "./../styles/rollout.css";

import TargetingPanel from "../components/TargetingPanel";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getFlag,
  getRolloutPercentage,
  updateRolloutPercentage,
} from "../services/api";

function FlagDetail() {

    const { key } = useParams();

    const [flag, setFlag] = useState(null);
    const [rollout, setRollout] = useState(0);

    useEffect(() => {
        loadFlag();
    }, []);

    async function loadFlag() {
        try {
            const data = await getFlag(key);

setFlag(data);

const rolloutData = await getRolloutPercentage(key);

setRollout(rolloutData.rollout_percentage);
        } catch (error) {
            console.error(error);
        }
    }

    async function saveRollout() {

  try {

    await updateRolloutPercentage(key, rollout);

    alert("Rollout updated successfully!");

  } catch (error) {

    console.error(error);

    alert("Failed to update rollout.");

  }

}

    if (!flag) {
        return <h2>Loading...</h2>;
    }

   return (
  <div className="flag-detail-page">

    <Link className="back-link" to="/features">
      ← Back to Features
    </Link>

    <h1 className="page-title">Flag Details</h1>

    <div className="detail-card">

      <h2>Feature Information</h2>

      <table className="detail-table">

        <tbody>

          <tr>
            <td className="label">Feature Key</td>
            <td className="value">{flag.key}</td>
          </tr>

          <tr>
            <td className="label">Type</td>
            <td className="value">{flag.type}</td>
          </tr>

          <tr>
            <td className="label">Default Value</td>
            <td className="value">
              {String(flag.enabled)}
            </td>
          </tr>

          <tr>
            <td className="label">Status</td>

            <td>

              <span
                className={
                  flag.enabled
                    ? "status-badge enabled"
                    : "status-badge disabled"
                }
              >
                {flag.enabled ? "Enabled" : "Disabled"}
              </span>

            </td>

          </tr>

          <tr>
            <td className="label">Description</td>
            <td className="value">
              {flag.description || "No description"}
            </td>
          </tr>

        </tbody>

      </table>

    </div>
    <br></br>
    <br></br>
    

    <TargetingPanel flagKey={flag.key} />
    <br></br>
    <br></br>

    <div className="rollout-card">

  <h2>Percentage Rollout</h2>

  <input
    type="range"
    min="0"
    max="100"
    value={rollout}
    onChange={(e) => setRollout(Number(e.target.value))}
    className="rollout-slider"
  />

  <p className="rollout-label">
    Enabled for <strong>{rollout}%</strong> of users
  </p>

  <button
    className="rollout-button"
    onClick={saveRollout}
  >
    Save Rollout
  </button>

</div>

<br />


  </div>
);

}

export default FlagDetail;