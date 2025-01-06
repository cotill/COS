"use client"; // Marks the component as a client component

import Headingbar from "@/components/employeeComponents/Headingbar";
import UserInfo from "@/components/employeeComponents/user-information";
import ChangePassword from "@/components/employeeComponents/user-pw-change";
import {createClient} from '@/utils/supabase/client';
import { User } from "lucide-react";
import { useState, useEffect } from "react";
// import { Eye, EyeOff } from "lucide-react";



export default function SettingsPage() {
  const [email, setEmail] = useState(""); 
  const [level, setLevel] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(prevState => !prevState);

  const fetchData = async () => {
    const supabase = createClient();

    // get session stuff
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("error...", sessionError);
      return;
    }

    // from session stuff, get user id
    const userId = session.user.id; 
    const { data, error } = await supabase
      .from("Employees")
      .select("email, level")
      .eq("employee_id", userId)  // match userid with the employee id
      .single(); // only 1 record returned

    if (error) {
      console.error("error getting user data:", error);
    } else {
      setEmail(data.email); 
      setLevel(data.level); 
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    console.log("textboxes cleaned")
  };

  const handleConfirm = () =>{
    console.log("submit pw change not implemented yet")
  } 

  return (
    <>
      <Headingbar text="Settings" />
      <UserInfo email={email} level={level} />
      <ChangePassword
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
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
