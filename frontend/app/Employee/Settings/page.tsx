import Headingbar from "@/components/employeeComponents/Headingbar";
import UserInfo from "@/components/employeeComponents/user-information";
import ChangePassword from "@/components/employeeComponents/user-pw-change";
import {createClient} from '@/utils/supabase/server';
// import { useState } from "react";
import { redirect } from "next/navigation";


export default async function SettingsPage() {
  // const [email, setEmail] = useState(""); 
  // const [level, setLevel] = useState(null);
  // const [department, setDepartment] = useState(null);

  
  const supabase = await createClient();

    // get session stuff
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if ( userError || !user) {
      redirect("/sign-in")
    }

    // from session stuff, get user id
    const userId = user.id; 
    // const { data, error } = await supabase
    //   .from("Employees")
    //   .select("email, level, department")
    //   .eq("employee_id", userId)  // match userid with the employee id
    //   .single(); // only 1 record returned

    // if (error) {
    //   console.error("error getting user data:", error);
    // } else {
    //   setEmail(data.email); 
    //   setLevel(data.level); 
    //   setDepartment(data.department);
    // }

  return (
    <>
      <Headingbar text="Settings" />
      <UserInfo userId={userId}/>
      <ChangePassword/>
    </>
  );
}

