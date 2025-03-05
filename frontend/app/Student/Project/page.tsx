import Headingbar from "@/components/employeeComponents/Headingbar";
import StudentProjectDetail from "@/components/studentComponents/student-project-detail";
import { Employee, Project } from "@/utils/types";
import { createClient } from "@/utils/supabase/server";

export default async function projectpage(){
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await (await supabase).auth.getUser();

  if (userError || !user) {
    console.error("Error getting user: ", userError);
    return
  }

  const [{ data: studentInfo, error: studentInfoError }, project] = await Promise.all([
    (await supabase).from("Students").select("*").eq("student_id", user.id).single(),
    await getProjectById(supabase, user.id),
  ]);

  if (studentInfoError || !studentInfo) {
    console.error("Error getting student information: ", studentInfoError);
    return
  }

  if (project === null) {
    return <div>Error retrieving project! Please contact system admin</div>;
  }
  const sponsorInfo = project.sponsor_email ? await (await supabase).from("Employees").select("*").eq("email", project.sponsor_email).single() : null;

  return (
    <>
      <Headingbar
        text={`${project.title} Details`}
      />
      <div>
        <StudentProjectDetail project={project} sponsorInfo={sponsorInfo?.data as Employee | null}/>
      </div>
    </>
  );
}
async function getProjectById(supabase: ReturnType<typeof createClient>, userId: string): Promise<Project | null> {
  const { data: projectInfo, error } = await (await supabase).from("Students").select(`*,Teams:team_id (*,Projects:project_id (*))`).eq("student_id", userId).single();
  return error ? null : (projectInfo.Teams.Projects);
}