import {createClient} from './supabase/server';
import { redirect } from 'next/navigation';
import { UserRole, Employee, Student, EmployeeLevel, AuthResult } from './types';

const  requireAuth = async (allowedRoles: UserRole[], minEmployeeLevel?:EmployeeLevel):Promise<AuthResult> => {
    const supabase = await createClient();
    const {data: userInfo, error: authError} = await supabase.auth.getUser();
    
    if (authError || !userInfo.user) {
        return {isAuthenticated: false, userRole: null};
    }

    //Fetch user details
    const {data: employeeInfo , error: empError} = await supabase.from("Employees").select("*").eq('Employee_id',userInfo.user.id).single();

    if (employeeInfo){
        //the user is Employee
        const {level} = employeeInfo as Employee;
        if(allowedRoles.includes(UserRole.EMPLOYEE) && (!minEmployeeLevel || level >= minEmployeeLevel)){
            // if the page calling auth.ts allows for employee users and the current level is at least the minlevel needed
            return {isAuthenticated: true, userRole : UserRole.EMPLOYEE, userInfo:employeeInfo}
        }
    }
    const {data: studentInfo, error: stuError} = await supabase.from("Students").select("*").eq("Student_id", userInfo.user.id).single();
    if(studentInfo){
        if(allowedRoles.includes(UserRole.STUDENT)){
            return {isAuthenticated: true , userRole: UserRole.STUDENT, userInfo:studentInfo as Student};
        }
    }

    // else the user doesn't meet the authorization requirements
    return{isAuthenticated: false, userRole: null}
} 

export {requireAuth};