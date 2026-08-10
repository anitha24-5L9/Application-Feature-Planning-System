import {
  createContext,
  useContext,
  useState,
} from "react";

// ==========================================
// Environment Context
// ==========================================

export const EnvironmentContext =
  createContext(null);

// ==========================================
// Available Environments
// ==========================================

const DEFAULT_ENVIRONMENTS = [
  "development",
  "testing",
  "staging",
];

// ==========================================
// Environment Provider
// ==========================================

export function EnvironmentProvider({
  children,
}) {
  const [environments] = useState(
    DEFAULT_ENVIRONMENTS
  );

  const [environment, setEnvironmentState] =
    useState(() => {
      const savedEnvironment =
        localStorage.getItem(
          "selectedEnvironment"
        );

      if (
        savedEnvironment &&
        DEFAULT_ENVIRONMENTS.includes(
          savedEnvironment.toLowerCase()
        )
      ) {
        return savedEnvironment.toLowerCase();
      }

      return "development";
    });

  // ========================================
  // Change Environment
  // ========================================

  function setEnvironment(value) {
    const normalizedValue =
      String(value || "")
        .trim()
        .toLowerCase();

    if (
      !DEFAULT_ENVIRONMENTS.includes(
        normalizedValue
      )
    ) {
      return;
    }

    setEnvironmentState(
      normalizedValue
    );

    localStorage.setItem(
      "selectedEnvironment",
      normalizedValue
    );
  }

  // ========================================
  // Context Value
  // ========================================

  return (
    <EnvironmentContext.Provider
      value={{
        environment,
        setEnvironment,
        environments,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
}

// ==========================================
// Custom Hook
// ==========================================

export function useEnvironment() {
  const context =
    useContext(EnvironmentContext);

  if (!context) {
    throw new Error(
      "useEnvironment must be used inside EnvironmentProvider"
    );
  }

  return context;
}