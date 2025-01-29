'use client'

import { Dialog } from "@/components/ui/dialog"
import { TeamDetailsDialog } from './team-detail';
import { Employee } from '@/utils/types';
import ApplicationTable from "./applicationTable";
import {ApplicationPagination} from "./applicationPagination";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmationDialog } from "../confirmationPopup";
import { AlertDialog } from "../ui/alert-dialog";
import { useApplications } from '@/hooks/useApplication';
interface ApplicationListProps {
  projectId: number,
  employeeInfo: Employee
}
export default function ApplicationList({projectId, employeeInfo}:ApplicationListProps) {
  const applicationsPerPage = 5;
  const {
    isLoading,
    isRefreshingTable,
    applications,
    currentPage,
    setCurrentPage,
    totalPages,
    currentApplications,
    selectedTeam,
    setSelectedTeam,
    isAnyApplicationApproved,
    handleApprove,
    handleReject,
    handlePending,
    handleDeleteApplication,
    handleDeleteAllApps,
    alertDialogOpen,
    setAlertDialogOpen,
    alertDialogProps} = useApplications ({project_id:projectId,employeeInfo, applicationPerPage: 5});

  if(isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }
  if (applications == null){
    return (
      <div className="space-y-4 text-white">
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
              width: "",
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