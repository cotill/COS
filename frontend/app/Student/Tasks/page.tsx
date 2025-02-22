import Headingbar from "@/components/employeeComponents/Headingbar";
import UnauthorizedPage from "@/components/unAuthorized";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function taskspage() {
  const supabase = await createClient();

  // Get authenticated user
  const { data: userInfo, error: authError } = await supabase.auth.getUser();
  if (!userInfo.user || authError) {
    redirect("/sign-in");
  }

  // Fetch student info
  const { data: studentInfo, error: stuError } = await supabase
  .from("Students")
  .select(
    `
    *,
    Teams:team_id (
      *,
      Projects:project_id (*)
    )
  `
  )
  .eq("student_id", userInfo.user.id)
  .single();

  console.log(studentInfo)

  if (!studentInfo || stuError) {
    return <UnauthorizedPage />;
  }

  return (
    <>
      <Headingbar text="Student Tasks" />
      <div>
        <h2>Student Information</h2>
        <p>Name: {studentInfo.full_name}</p>
        <p>Email: {studentInfo.email}</p>
        <p>Major: {studentInfo.major}</p>

      </div>
    </>
  );
}