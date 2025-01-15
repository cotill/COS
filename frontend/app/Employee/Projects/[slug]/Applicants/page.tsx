import ApplicationList from "@/components/employeeComponents/application-list";
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';
import { Employee, Project } from "@/utils/types";
import Headingbar from "@/components/employeeComponents/Headingbar";
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react';

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
      <Headingbar text = {projectInfo.title +" Applications"} />
      <div className="pt-4 space-y-4">
      <div className="flex justify-between">
          {/* <SearchBar 
            value={searchTerm} 
            onSearchChange={handleSearchChange} 
            filter={filter} 
            onFilterChange={handleFilterChange} 
            placeholder={`Search by ${filter}...`}
          /> */}
          <Button style={{color: "white", fontWeight: "bold", fontSize: "16px", width: "17.5%", borderRadius: "20px" }} 
          className="bg-red-400 hover:bg-red-500 flex items-center space-x-4">
              <span>Delete All (fix me)</span>
              <Trash2/>
          </Button>
        </div>
        <ApplicationList projectId={projectId} employeeInfo={employeeInfo}/>
      </div>
    </>
  )
}

