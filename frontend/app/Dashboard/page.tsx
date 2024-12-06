import { requireAuth } from "@/utils/auth";
import { EmployeeLevel, UserRole, AuthResult, Employee, EmployeePages } from "@/utils/types";
import EmpLayout from "@/components/employeeComponents/employee-Layout";
import { signOutAction } from "../actions";

export default async function employeeDashboard(){
    const {isAuthenticated, userRole, userInfo} : AuthResult = await requireAuth([UserRole.EMPLOYEE], EmployeeLevel.LEVEL_0);
    const employeeInfo = userInfo as Employee;
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
            {/* <ViewProjects /> */}
        </EmpLayout>
      </div>
    );
}