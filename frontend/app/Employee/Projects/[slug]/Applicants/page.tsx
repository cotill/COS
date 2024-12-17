import ApplicationList from "@/components/employeeComponents/application-list";
import { createClient } from "@/utils/supabase/server";
import { Application } from "@/utils/types";

export default async function ApplicantsPage({params,} : {params : Promise<{slug : string}>}) {
  const projectId = (await params).slug;
  const projectApplications = await getApplicationsByProjectId(projectId);
  return (
    <div className="p-6">
      Applicants page
      <p>Application id {projectId}</p>
      <ApplicationList projectId={projectId} projectApplications={projectApplications} />
    </div>
  )
}
async function getApplicationsByProjectId(projectId: string): Promise<Application[] | null> {
  const supabase = await createClient();
  const {data, error} = await supabase.from("Applications").select("*").eq('"project_id"',projectId); 
  return error ? null : data as Application[] ;
}

