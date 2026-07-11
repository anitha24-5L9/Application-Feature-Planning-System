import "./../styles/flagDetail.css";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFlag } from "../services/api";

function FlagDetail() {

    const { key } = useParams();

    const [flag, setFlag] = useState(null);

    useEffect(() => {
        loadFlag();
    }, []);

    async function loadFlag() {
        try {
            const data = await getFlag(key);
            setFlag(data);
        } catch (error) {
            console.error(error);
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

    

  </div>
);

}

export default FlagDetail;