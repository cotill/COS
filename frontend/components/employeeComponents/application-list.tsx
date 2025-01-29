'use client'

import { useEffect, useState } from 'react'
import { Dialog } from "@/components/ui/dialog"
import { TeamDetailsDialog } from './team-detail';
import { Application_Status, Member,Application, Employee, EmployeeLevel, Project_Status } from '@/utils/types';
import { fetchApplications, rejectOtherApplications, updateApplicationStatus, createStudentAccounts, deleteApplication, confirmEmployeeAuthorization, updateProjectStatus, deleteAllApps } from "@/app/project_applications_util/application";
import ApplicationTable from "./applicationTable";
import {ApplicationPagination} from "./applicationPagination";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmationDialog, ConfirmationDialogProp } from "../confirmationPopup";
import { AlertDialog } from "../ui/alert-dialog";
interface ApplicationListProps {
  projectId: number,
  employeeInfo: Employee
}
export default function ApplicationList({projectId, employeeInfo}:ApplicationListProps) {
    const [isLoading, setIsLoading] = useState(true); // shows the loading icon for the entire page
    const [isRefreshingTable, setRefreshingTable] = useState(false); // controls the loading icon for the table 
    const [currentPage, setCurrentPage] = useState(1)
    const applicationsPerPage = 5
    const [projectApplications, setProjectApplications] = useState<Application[] | null> (null);
    const totalPages = projectApplications ? Math.ceil(projectApplications.length / applicationsPerPage) : 0
  
    const indexOfLastApplication = currentPage * applicationsPerPage
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage
    const currentApplications = projectApplications ? projectApplications.slice(indexOfFirstApplication, indexOfLastApplication) : []

    const [selectedTeam, setSelectedTeam] = useState<Application | null>(null);
    const isAnyApplicationApproved = projectApplications?.some((application) => application.status === Application_Status.APPROVED);

    /*states that controls the alert dialog*/
    const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);
    const [alertDialogProps, setAlertDialogProps] = useState<ConfirmationDialogProp | null>(null);
  
    /**
     * The function will load all applications for a project
     */
    const loadApplications = async() =>{

      const isIntialLoad : boolean = projectApplications === null; // if there are no application we assume it because its the initial load

      try {
        if (isIntialLoad){
          setIsLoading(true); // set the loading icon for the page
        }
        else {
          setRefreshingTable(true);
        }

        const application_result = await fetchApplications(projectId);
        setProjectApplications(application_result);
      
      }catch(err){
        setProjectApplications(null);
        console.error(err);
      
      }finally{
        if (isIntialLoad){
          setIsLoading(false); // set the loading icon for the page to false
        }
        else {
          setRefreshingTable(false); //set the control table loading icon to false
        }
      }
    };

    useEffect(() => {
      loadApplications();
    }, []);
    
    /**
     * 
     * @param application_id The application id to approve
     * @param project_id The project id of the application
     * @param university The university of the team
     * @returns  void but the function will update the application status to approved, create student accounts for the approved team and reject all other applications for the same project.
     */
    const handleApprove = async (application_id: number, project_id: number, university: string) => {
      if (!confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2)) {
        alert("Approval requires you to be level 2+");
        return;
      }

      try {
        await updateApplicationStatus(application_id,Application_Status.APPROVED, selectedTeam?.team_name);
      } catch (error) {
        alert(error)
      }

      try {
        await rejectOtherApplications(application_id,project_id)
        
      } catch (error) {
        alert(error)
      }
    
      await loadApplications();

      try {
        const teamMembers = selectedTeam?.members as Member[];
        await createStudentAccounts(teamMembers, project_id, university);
      } catch (error) {
        console.error(`Error creating student accounts:\n${error}`)
        alert(`Error creating student accounts please contact system admin`)
      }
       
      try {
        await updateProjectStatus(projectId,Project_Status.AWARDED,application_id)
      } catch (error) {
        alert(error)
      }
    }

    /**
     * 
     * @param application_id The application id to reject
     * @returns void but the function will update the application status to rejected and fetch the data after update
     */
    const handleReject = async (application_id: number) => {
      // Handle reject logic
      if (!confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2)) {
        alert("Rejection requires you to be level 2+");
        return;
      }
      try {
        await updateApplicationStatus(application_id,Application_Status.REJECTED, selectedTeam?.team_name);
      } catch (error) {
        alert(error)
      }

      await loadApplications();
    }
    
    /**
     * 
     * @param application_id The application id to set to pending
     * @returns void but the function will update the application status to pending and fetch the data after update
    */
    const handlePending = async (application_id: number) => {
      // Handle pending logic
      if (!confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2)) {
        alert("Set application to pending requires you to be level 2+");
        return;
      }
      try {
        await updateApplicationStatus(application_id,Application_Status.PENDING, selectedTeam?.team_name);
      } catch (error) {
        alert(error)
      }

      await loadApplications();
    }

    /**
     * 
     * @param application_id The application id to delete
     * @returns void but the function will delete the application and fetch the data after deletion
     */
    const handleDeleteApplication = async (application_id: number) => {
      // Handle delete logic
      if (!confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2)) {
        alert("Deleting an application requires you to be level 2+");
        return;
      }
      if(selectedTeam?.status === Application_Status.APPROVED){
        alert("Can't delete an application that is already approved");
        return;
      }
      
      try {
        await deleteApplication(application_id);
      } catch (error) {
        alert(error);
      }
      
      await loadApplications();
    }
  const handleConfrimDeleteAllApps = async() => {
    try {
      await deleteAllApps(projectId); 
    } catch (error) {
      alert(error);
    }
    finally{
      setAlertDialogOpen(false);
      await loadApplications();
    }
  }

  async function handleDeleteAllApps()
  {
    if (!confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2)) {
      alert("Deleting all applications requires you to be level 2+");
      return;
    }

      // set the properties for the confirmation dialog
      setAlertDialogProps({
        title: "Confirm Delete All",
        description: (<>Are you sure you want to <span className='underline'>delete all</span> unapproved applications? <br />
          This action cannot be undone.</>),
        confirmationLabel: "Delete",
        onConfirm: () => {handleConfrimDeleteAllApps()},
        onCancel:() => {setAlertDialogOpen(false);}
      });
      setAlertDialogOpen(true)
  }

  if(isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }
  if (projectApplications == null){
    return (
      <div className="space-y-4">
        Error retrieving applications for project with project id {projectId}! Please contact system admin
      </div>
    );
  }

  return (
    <>
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
              handleDeleteAllApps();
            }}
          >
            <span>Delete All (fix me)</span>
            <Trash2 />
          </Button>
        </div>
      <div className="space-y-4">
        {/* Displays the application table */}
        <ApplicationTable
          currentApplications={currentApplications}
          onViewDetails ={setSelectedTeam}
          onDeleteApplication={handleDeleteApplication}
          employeeInfo={employeeInfo}
          isRefreshingTable={isRefreshingTable}
        />
        {/* Display the pagination */}
        <ApplicationPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
        />

        {/* Display the team application*/}
        <Dialog open={selectedTeam !== null} onOpenChange={() => setSelectedTeam(null)}>
          <TeamDetailsDialog
            team={selectedTeam}
            onClose={() => setSelectedTeam(null)}
            onApprove={isAnyApplicationApproved ? undefined : handleApprove}
            onReject={isAnyApplicationApproved ? undefined : handleReject}
            onPending={isAnyApplicationApproved ? undefined : handlePending}
          />
        </Dialog>
      </div>
      {/* Alert Dialog will display when the user clicks the deleteAll button */}
      <AlertDialog open={alertDialogOpen} onOpenChange={()=> setAlertDialogOpen(false)}>
        {alertDialogProps && <ConfirmationDialog {...alertDialogProps}/>}
      </AlertDialog>
    </div>
    </>
  )
}