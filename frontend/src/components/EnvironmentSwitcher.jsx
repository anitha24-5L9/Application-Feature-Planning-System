import { useContext } from "react";
import { EnvironmentContext } from "../context/EnvironmentContext";
import "./EnvironmentSwitcher.css";

function EnvironmentSwitcher() {

    const { environment, setEnvironment } =
        useContext(EnvironmentContext);

    return (

        <div className="environment-box">

            <label>

                Environment

            </label>

            <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
            >

                <option>Development</option>

                <option>Staging</option>

                <option>Production</option>

            </select>

        </div>

    );
}

export default EnvironmentSwitcher;