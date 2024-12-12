import { ProjectsList } from "@/components/employeeComponents/ProjectList";

async function getProject() {
  
}

export default async function projectpage(){
  // cosnt allProjects = await getProject();
    return (
      // <ProjectsList initialProjects={allProjects}/>

      <ProjectsList />
    );
}