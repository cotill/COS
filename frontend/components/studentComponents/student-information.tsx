"use client"

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface StudentInfoProps {
    userId: string
  }

export default function StudentInfo ({ userId }: StudentInfoProps) {
    const [TTGEmail, setTTGEmail] = useState(""); 
    const [email, setEmail] = useState("");

    const supabase = createClient();

    useEffect(() => {
        // This will fetch data when the component mounts
        const fetchUserData = async () => {
            const { data: userInfo, error: userError } = await supabase
                .from("Students")
                .select("email, ttg_email")
                .eq("student_id", userId)  // match userid with the employee id
                .single(); // only 1 record returned

            if (userError) {
                console.error("error getting user data:", userError);
            } else {
                setEmail(userInfo.email);
                setTTGEmail(userInfo.ttg_email);
            }
        };

        fetchUserData(); 
      }, [userId]);

    return (
        <div>
            <div className="p-4 text-white">
                <h3 className="text-lg font-semibold underline mb-2">Information</h3>
                <div>
                    <p className="mb-1">
                        <span className="font-medium">TTG Email: </span>
                        <span className="text-gray-400">{TTGEmail}</span>
                    </p>
                    <p className="mb-1">
                        <span className="font-medium">Personal Email: </span>
                        <span className="text-gray-400"> {email}</span>
                        {/* db needs department */}
                    </p>
                </div>
            </div>
        </div>
    );
}


