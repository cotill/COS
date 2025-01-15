"use client";
import ApplicationList from "@/components/employeeComponents/application-list";
import { createClient } from "@/utils/supabase/client";
import Headingbar from "@/components/employeeComponents/Headingbar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Employee, Project } from "@/utils/types";
interface applicationActionProps {
	project: Project;
	employee: Employee;
}
export default function ApplicationActions({
	project,
	employee,
}: applicationActionProps) {
	const deleteAllApps = () => {
		console.log("testing the button");
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
