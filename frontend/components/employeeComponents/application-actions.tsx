"use client";
import ApplicationList from "@/components/employeeComponents/application-list";
import { createClient } from "@/utils/supabase/client";
import Headingbar from "@/components/employeeComponents/Headingbar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Application_Status, Employee, Project } from "@/utils/types";
interface applicationActionProps {
	project: Project;
	employee: Employee;
}
export default function ApplicationActions({
	project,
	employee,
}: applicationActionProps) {
	const deleteAllApps = async() => {
		console.log("testing the button");
        const supabase = createClient();
        const {data: projInfo, error: projError} = await supabase.from("Applications").delete().eq('project_id',project.project_id).neq('status',Application_Status.APPROVED);
		console.log(projInfo)
        if(projError){
			console.log("delete application error: ", projError)
		}
	};
	return (
		<>
			<Headingbar text={project.title + " Applications"} />
			<div className="pt-4 space-y-4">
				<div className="flex justify-between">
					{/* <SearchBar 
              value={searchTerm} 
              onSearchChange={handleSearchChange} 
              filter={filter} 
              onFilterChange={handleFilterChange} 
              placeholder={`Search by ${filter}...`}
            /> */}
					<Button
						style={{
							color: "white",
							fontWeight: "bold",
							fontSize: "16px",
							width: "17.5%",
							borderRadius: "20px",
						}}
						className="bg-red-400 hover:bg-red-500 flex items-center space-x-4"
						onClick={() => {
							deleteAllApps();
						}}
					>
						<span>Delete All (fix me)</span>
						<Trash2 />
					</Button>
				</div>
				<ApplicationList
					projectId={project.project_id}
					employeeInfo={employee}
				/>
			</div>
		</>
	);
}
