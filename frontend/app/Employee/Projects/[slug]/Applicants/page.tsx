import ApplicationActions from "@/components/employeeComponents/application-actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';
import { Application_Status, Employee, Project } from "@/utils/types";


export default async function ApplicantsPage({params,} : {params : Promise<{slug : string}>}) {
  const projectId = (await params).slug;
  const supabase = await createClient();
  const {data, error} = await supabase.auth.getUser();
  if(error){
    redirect("/sign-in");
  }
  const {data: empInfo, error: empError} = await supabase.from("Employees").select("*").eq('employee_id',data.user?.id).single();
  if(empError){
    redirect("/sign-in");
  }
  const employeeInfo = empInfo as Employee;
  const {data: projInfo, error: projError} = await supabase.from("Projects").select("*").eq('project_id',projectId).single();
  const projectInfo = projInfo as Project;

  return (
    <>
      <ApplicationActions project={projectInfo} employee={employeeInfo}/>
    </>
  )
}

