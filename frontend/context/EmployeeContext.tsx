"use client";

import { createContext, useContext } from "react";

const EmployeeContext = createContext<{ employeeLevel: number | undefined }>({ employeeLevel: undefined });

export const EmployeeProvider = ({ employeeLevel, children }: { employeeLevel: number; children: React.ReactNode }) => {
  return <EmployeeContext.Provider value={{ employeeLevel }}>{children}</EmployeeContext.Provider>;
};

export const useEmployee = () => useContext(EmployeeContext);
