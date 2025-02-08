import React from 'react';
import { UserRole } from "@/utils/types";
import EmpLayout from "@/components/employeeComponents/employee-Layout";
import { signOutAction } from "../actions";
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import UnauthorizedPage from "@/components/unAuthorized";
import { EmployeeProvider } from "@/context/EmployeeContext";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: userInfo, error: authError } = await supabase.auth.getUser();
  let metadata = userInfo.user?.user_metadata;

  if (!userInfo.user || authError) {
    redirect("/sign-in");
  }

  const { data: employeeInfo, error: empError } = await supabase
    .from("Employees")
    .select("*")
    .eq('employee_id', userInfo.user.id)
    .single();

  if (!employeeInfo || empError) {
    return <UnauthorizedPage />;
  }

  // console.log('Employee Info:', employeeInfo);

  const [firstName, lastName] = employeeInfo.full_name ? employeeInfo.full_name.split(" ") : ["N/A", "N/A"];

  return (
    <EmployeeProvider employeeLevel={employeeInfo.level}>
      <EmpLayout
        userRole={UserRole.EMPLOYEE}
        employeeLevel={employeeInfo.level}
        firstName={firstName}
        lastName={lastName}
        signOutFunc={signOutAction}
      >
        {children}
      </EmpLayout>
    </EmployeeProvider>
  );
}
