import { ProjectsList } from "@/components/employeeComponents/ProjectList";

async function getProject() {
  
}

export default async function projectpage(){
  // cosnt allProjects = await getProject();
    return (
      // <ProjectsList initialProjects={allProjects}/>
      <>
      // make the suheading its own componet and pass it the name
      <h2> This is the project page</h2>
      <ProjectsList />
      </>
    );
}