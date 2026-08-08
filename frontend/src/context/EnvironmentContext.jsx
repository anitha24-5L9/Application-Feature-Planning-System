import { createContext, useEffect, useState } from "react";

export const EnvironmentContext = createContext();

const ENVIRONMENTS = [
  "Development",
  "Testing",
  "Production",
];

export function EnvironmentProvider({ children }) {
  const [environment, setEnvironment] = useState(() => {
    return (
      localStorage.getItem("selectedEnvironment") ||
      "Development"
    );
  });

  useEffect(() => {
    localStorage.setItem(
      "selectedEnvironment",
      environment
    );
  }, [environment]);

  function changeEnvironment(value) {
    if (!ENVIRONMENTS.includes(value)) {
      return;
    }

    setEnvironment(value);
  }

  return (
    <EnvironmentContext.Provider
      value={{
        environment,
        setEnvironment: changeEnvironment,
        environments: ENVIRONMENTS,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
}