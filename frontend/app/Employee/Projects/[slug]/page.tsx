import ProjectDetail from "@/components/employeeComponents/project-detail";
import Headingbar from "@/components/employeeComponents/Headingbar";
import {createClient} from '@/utils/supabase/server';
import { Project } from "@/utils/types";

const supabase = createClient();

export default async function ProjectPage({params,} : {params : Promise<{slug : string}>}) {
    const projectId = (await params).slug;
    const project  = await getProjectById(supabase, projectId);
    if (project === null){
        return <div>
            Error retrieving project with project id, {projectId}! Please contact system admin
        </div>
    }
    const creatorName = await getEmployeeName(supabase, project.creator_email);
    const approvalName = project.approval_email ? await getEmployeeName(supabase, project.approval_email) : null;
    const dispatcherName = project.dispatcher_email ? await getEmployeeName(supabase, project.dispatcher_email) : null

    return (
        <div>
            <Headingbar text={project.title} />
           
            <ProjectDetail project={project} creatorName={creatorName} approvalName={approvalName} dispatcherName={dispatcherName}/>
        </div>
    );
}
async function getProjectById(supabase: ReturnType<typeof createClient> ,projectId: string) : Promise<Project | null> {
    const {data: projectInfo , error} = await (await supabase).from("Projects").select("*").eq('"project_id"',projectId).single();
    return error ? null : projectInfo as Project;
}

const getEmployeeName = async(supabase: ReturnType<typeof createClient>, query_email: string): Promise<string> => {
    const {data, error} = await (await supabase).from("Employees").select("full_name").eq("email",query_email).single();
    const name : string | null  | undefined= data?.full_name;
    if(name === null || name === undefined || error || name.length === 0){
      return "N/A"
    }
    return name;
}
