import { EmployeeLevel, UserRole, AuthResult, Employee, EmployeePages } from "@/utils/types";
import EmpLayout from "@/components/employeeComponents/employee-Layout";
import { signOutAction } from "../actions";
import { redirect } from 'next/navigation';
import {createClient} from '@/utils/supabase/server';
import UnauthorizedPage from "@/components/unAuthorized";
import {type User} from "@supabase/supabase-js"

export default async function RootLayout({children,}: {children: React.ReactNode;}) {
    const supabase = await createClient();
    const {data: userInfo, error: authError} = await supabase.auth.getUser();
    // console.log("user info is...", userInfo)
      
    if (!userInfo.user || authError) {
        // console.log("can't access user is ", userInfo)
        redirect("/sign-in");
    }
    
    const {data: employeeInfo , error: empError} = await supabase.from("Employees").select("*").eq('Employee_id',userInfo.user.id).single();
      // console.log("employee info is...", userInfo)
  
    if(!employeeInfo){
      return <UnauthorizedPage />;
    }
    const [firstName, lastName] = employeeInfo.full_name.split(" ");

    const renderEmployeeContent = () => {
      switch(employeeInfo.level){
        case 0:
          return <p style={{color: "pink"}}> Level 0 Employee: Limited Access</p>
          case 1:
            return <p style={{ color: 'blue' }}>Level 1 Employee: Can initialize project ideas</p>;
          case 2:
            return <p style={{ color: 'green' }}>Level 2 Employee: Can review and approve projects</p>;
          case 3:
            return <p style={{ color: 'purple' }}>Level 3 Employee: Can sponsor projects</p>;
          default:
            return <p>Error loading dashboard</p>;
      }
    }

    return (
        <div>
        <EmpLayout
          userRole={UserRole.EMPLOYEE}
          activePage={EmployeePages.PROJECTS}
          employeeLevel={employeeInfo.level}
          firstName={firstName}
          lastName={lastName}
          signOutFunc={signOutAction}
          >
          <div>
          <h1>Employee Dashboard</h1>

          {renderEmployeeContent()}
          </div>
          {children}
        </EmpLayout>
      </div>
    );
};