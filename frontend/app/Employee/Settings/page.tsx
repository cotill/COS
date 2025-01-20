import Headingbar from "@/components/employeeComponents/Headingbar";
import UserInfo from "@/components/employeeComponents/user-information";
import ChangePassword from "@/components/employeeComponents/user-pw-change";
import {createClient} from '@/utils/supabase/server';
// import { useState } from "react";
import { redirect } from "next/navigation";


export async function SettingsPage() {
  // const [email, setEmail] = useState(""); 
  // const [level, setLevel] = useState(null);
  // const [department, setDepartment] = useState(null);

  
  const supabase = await createClient();

    // get session stuff
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      redirect("/sign-in")
    }

    // from session stuff, get user id
    const userId = session.user.id; 
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
  
  

  

  const handlePasswordReset = async (password: string, confirmPassword: string) => {
    const supabase = await createClient();

    if (!password || !confirmPassword) {
      alert("Please confirm your new password");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: password });

      if (error) {
        alert("Password update failed");
        console.error("Error updating password:", error);
      } else {
        alert("Password updated successfully");
        // redirect("/Employee/Settings");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleConfirm = (newPassword: string, confirmPassword: string) => {
    handlePasswordReset(newPassword, confirmPassword);
    // how would i erase the inputted text? refresh? 
  };
  

  return (
    <>
      <Headingbar text="Settings" />
      <UserInfo userId={userId}/>
      <ChangePassword handleConfirm={handleConfirm}/>
    </>
  );
}

