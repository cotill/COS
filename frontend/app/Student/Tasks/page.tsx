import Headingbar from "@/components/employeeComponents/Headingbar";
import UnauthorizedPage from "@/components/unAuthorized";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ProgressBar from "@/components/studentComponents/ProgressBar"; 

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

  if (!studentInfo || stuError) {
    console.error("Student Info Fetch Error:", stuError);
    return <UnauthorizedPage />;
  }

  // Fetch all students in the same team
  const { data: teamMembers, error: teamError } = await supabase
    .from("Students")
    .select("*")
    .eq("team_id", studentInfo.team_id);

  if (teamError) {
    console.error("Error fetching team members:", teamError);
  }

  // Compute Task Counter
  const ndaTask = studentInfo.Teams.nda_file !== null ? 0 : 1;
  const projectHasGithub = studentInfo.Teams.Projects.github !== null;
  const githubCount = teamMembers.filter((member) => member.github !== null).length;
  const totalTasks = ndaTask + (projectHasGithub ? githubCount : 0);

  const progress = totalTasks === 0 ? 100 : 0; // Progress bar fills up if all tasks are done

  // Console log results
  console.log("Student Info:", studentInfo);
  console.log("Team Members:", teamMembers);
  console.log("NDA Task:", ndaTask);
  console.log("Project Has GitHub:", projectHasGithub);
  console.log("GitHub Count:", githubCount);
  console.log("Total Tasks:", totalTasks);
  console.log("Progress:", progress);

  return (
    <>
      <Headingbar text="Student Tasks" />

      {/* Task Counter */}
      <div>
        {/* Use the client component */}
        <ProgressBar progress={progress} />

        <p>NDA Task: {ndaTask}</p>
        <p>Project Has GitHub: {projectHasGithub ? "Yes" : "No"}</p>
        <p>GitHub Count: {githubCount}</p>
        <p>Total Tasks: {totalTasks}</p>
      </div>
    </>
  );
}
