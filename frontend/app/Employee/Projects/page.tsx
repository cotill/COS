import { ProjectsList } from "@/components/employeeComponents/ProjectList";
import Headingbar from "@/components/employeeComponents/Headingbar";

async function getProject() {
  
}

export default async function projectpage(){
  // cosnt allProjects = await getProject();
    return (
      // <ProjectsList initialProjects={allProjects}/>
      <>
      <Headingbar
        text='Some text'
      />
      <h2> This is the project page</h2>
      <ProjectsList />
      </>
    );
}