import ProjectDetail from "@/components/employeeComponents/project-detail";
import Headingbar from "@/components/employeeComponents/Headingbar";
import { createClient } from "@/utils/supabase/server";
import { Employee, Project } from "@/utils/types";
import { redirect } from "next/navigation";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const projectId = (await params).slug;
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await (await supabase).auth.getUser();

  if (userError || !user) {
    redirect("/sign-in");
  }

  // retrieve employee info and project info in parallel
  const [{ data: employeeInfo, error: employeeInfoError }, project] = await Promise.all([
    (await supabase).from("Employees").select("*").eq("employee_id", user.id).single(),
    await getProjectById(supabase, projectId),
  ]);

  if (employeeInfoError || !employeeInfo) {
    redirect("/sign-in");
  }

  if (project === null) {
    return <div>Error retrieving project with project id, {projectId}! Please contact system admin</div>;
  }
  const sponsorInfo = project.sponsor_email ? await (await supabase).from("Employees").select("*").eq("email", project.sponsor_email).single() : null;

  return (
    <div>
      <Headingbar text={project.title} />

      <ProjectDetail employeeInfo={employeeInfo as Employee} project={project} initialSponsorInfo={sponsorInfo?.data as Employee | null} />
    </div>
  );
}
async function getProjectById(supabase: ReturnType<typeof createClient>, projectId: string): Promise<Project | null> {
  const { data: projectInfo, error } = await (await supabase).from("Projects").select("*").eq('"project_id"', projectId).single();
  return error ? null : (projectInfo as Project);
}
