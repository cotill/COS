"use client"; // Marks the component as a client component

import Headingbar from "@/components/employeeComponents/Headingbar";
import UserInfo from "@/components/employeeComponents/user-information";
import ChangePassword from "@/components/employeeComponents/user-pw-change";
import {createClient} from '@/utils/supabase/client';
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";

// import { Eye, EyeOff } from "lucide-react";



export default function SettingsPage() {
  const [email, setEmail] = useState(""); 
  const [level, setLevel] = useState(null);
  const [department, setDepartment] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(prevState => !prevState);

  const fetchData = async () => {
    const supabase = createClient();

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
    const { data, error } = await supabase
      .from("Employees")
      .select("email, level, department")
      .eq("employee_id", userId)  // match userid with the employee id
      .single(); // only 1 record returned

    if (error) {
      console.error("error getting user data:", error);
    } else {
      setEmail(data.email); 
      setLevel(data.level); 
      setDepartment(data.department);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = () => {
    setNewPassword("");
    setConfirmPassword("");
    console.log("textboxes cleaned")
  };

  const handlePasswordReset = async (password: string, confirmPassword: string) => {
    const supabase = createClient();


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
        router.refresh(); // Refresh the page after successful update
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleConfirm = () => {
    handlePasswordReset(newPassword, confirmPassword);
    setNewPassword("");
    setConfirmPassword("");
  };
  

  return (
    <>
      <Headingbar text="Settings" />
      <UserInfo email={email} level={level} department={department}/>
      <ChangePassword
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        isVisible={isVisible}
        toggleVisibility={toggleVisibility}
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
      />
    </>
  );
}

