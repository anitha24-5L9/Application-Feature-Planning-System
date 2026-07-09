import { createContext, useState } from "react";

export const EnvironmentContext = createContext();

export function EnvironmentProvider({ children }) {
  const [environment, setEnvironment] = useState("Development");

  return (
    <EnvironmentContext.Provider value={{ environment, setEnvironment }}>
      {children}
    </EnvironmentContext.Provider>
  );
}