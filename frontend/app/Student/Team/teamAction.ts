"use server";
import { Student } from "@/utils/types";
import { createClient } from "@supabase/supabase-js";

export const handleDeleteStudentAccounts = async (deleteStudents: Partial<Student>[]) => {
  // console.log("Inside handleDeleteStudentAccounts log");

  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  // console.log(`Delete Students! Passed email: ${deleteStudents[0].email} student id: ${deleteStudents[0].student_id}`);

  const result = await Promise.allSettled(
    deleteStudents.map(async (student) => {
      return await supabaseAdmin.auth.admin.deleteUser(student.student_id!);
    })
  );

  return result;
};
