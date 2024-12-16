import ProjectDetail from "@/components/employeeComponents/project-detail";

export default async function ProjectPage({params,} : {params : Promise<{slug : string}>}) {
    const projectId = (await params).slug;
    const project  = await getProjectById(projectId);
    
    return (
        <div className="text-purple-300">
            project id is {projectId};
            <ProjectDetail project={{ id: projectId, name: "none", description: "idk" }}/>
        </div>
    );
}
async function getProjectById(projectId: string) {
    // this will call the acutal db

    const projects = [
        { id: "1", name: "Project One", description: "Description of Project One" },
        { id: "2", name: "Project Two", description: "Description of Project Two" },
        { id: "3", name: "Project Three", description: "Description of Project Three" },
    ];

    const project = projects.find(project => project.id === projectId);

    if (!project) {
        throw new Error(`Project with id ${projectId} not found.`);
    }

    return project;
}