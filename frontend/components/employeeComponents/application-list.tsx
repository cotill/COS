'use client'

import { useEffect, useState } from 'react'
import { Dialog } from "@/components/ui/dialog"
import { TeamDetailsDialog } from './team-detail';
import { Application_Status, Member,Application, Employee } from '@/utils/types';
import { fetchApplications, rejectAllExcept, updateApplicationStatus, createStudentAccounts, deleteApplication } from "@/app/user-applications/application";
import ApplicationTable from "./applicationTable";
import {ApplicationPagination} from "./applicationPagination";

interface ApplicationListProps {
  projectId: string,
  employeeInfo: Employee
}
export default function ApplicationList({projectId, employeeInfo}:ApplicationListProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1)
    const applicationsPerPage = 5
    const [projectApplications, setProjectApplications] = useState<Application[] | null> (null);
    const totalPages = projectApplications ? Math.ceil(projectApplications.length / applicationsPerPage) : 0
  
    const indexOfLastApplication = currentPage * applicationsPerPage
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage
    const currentApplications = projectApplications ? projectApplications.slice(indexOfFirstApplication, indexOfLastApplication) : []

    const [selectedTeam, setSelectedTeam] = useState<Application | null>(null);

    const loadApplications = async() =>{
      setIsLoading(true);
      try {
        const application_result = await fetchApplications(projectId);
        setProjectApplications(application_result);
      
      }catch(err){
        setProjectApplications(null);
        console.error(err);      
      
      }finally{
        setIsLoading(false);
      }
    };

    useEffect(() => {
      loadApplications();
    }, []);
    
    function authUserFunctionality(): boolean{
      if (employeeInfo.level < 2) {
        return false;
      }
      return true;
    }
    const handleApprove = async (application_id: number, project_id: number, university: string) => {
      if (!authUserFunctionality()) {
        alert("Approval requires you to be level 2+");
        return;
      }

      // change the team application status to approved
      try {
        await updateApplicationStatus(application_id,Application_Status.APPROVED, selectedTeam?.team_name);
      } catch (error) {
        alert(error)
      }

      // change the other applications for the same project to rejected
      try {
        await rejectAllExcept(application_id,project_id)
        
      } catch (error) {
        alert(error)
      }
    
      // fetch the data afger update
      await loadApplications();

      // create a func to create student accounts
      try {
        const teamMembers = selectedTeam?.members as Member[];
        await createStudentAccounts(teamMembers, project_id, university);
      } catch (error) {
        console.error(`Error creating student accounts:\n${error}`)
        alert(`Error creating student accounts:\n${error}`)
      }

    }
  
    const handleReject = async (application_id: number) => {
      // Handle reject logic
      if (!authUserFunctionality()) {
        alert("Rejection requires you to be level 2+");
        return;
      }
      try {
        await updateApplicationStatus(application_id,Application_Status.REJECTED, selectedTeam?.team_name);
      } catch (error) {
        alert(error)
      }

      // fetch the data after update
      await loadApplications();
    }
    const handleDeleteApplication = async (application_id: number) => {
      // Handle delete logic
      if (!authUserFunctionality()) {
        alert("Deleting an application requires you to be level 2+");
        return;
      }
      // confirmation popup

      // call deletion function
      await deleteApplication(application_id);
      
      // fetch the data after update
      await loadApplications();
    }

  if(isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }
  if (projectApplications == null){
    return     <div className="space-y-4">
      Error retrieving applications for project with project id {projectId}! Please contact system admin
    </div>
  } 
  return (
    <div className="space-y-4">
      <ApplicationTable 
        currentApplications={currentApplications}
        onViewDetails ={setSelectedTeam}
        onDeleteApplication={handleDeleteApplication}
      />
      <ApplicationPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => setCurrentPage(page)}
      />


      <Dialog open={selectedTeam !== null} onOpenChange={() => setSelectedTeam(null)}>
        <TeamDetailsDialog
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </Dialog>
      </div>

  )
}