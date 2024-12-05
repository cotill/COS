import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface Employee{
  email: string;
  password: string;
  full_name: string;
  level: number;
  Employee_id: string;
}
export default async function employeeDashboard(){
    const supabase = await createClient();
    const {data: userInfo, error: authError} = await supabase.auth.getUser();
    if (authError || !userInfo.user) {
      return redirect("/sign-in");
    }
    
    const {data: employeeInfo , error: empError} = await supabase.from("Employees").select("*").eq('Employee_id',userInfo.user.id).single();
    let employee: Employee | null = null;

    if (empError) {
        console.error('Error fetching employee data: ', empError);
        employee = null;

      } else {
        employee = employeeInfo as Employee
        console.log(employeeInfo)
      }
    const renderEmployeeContent = () => {
      switch(employee?.level){
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
        <h1>Employee Dashboard</h1>
        {renderEmployeeContent()}
      </div>
    );
}