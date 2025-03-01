"use client";
/*Encapsulate all application-project related state, making the logic resuable and cleaner to follow*/
import { useEffect, useState } from "react";
import { Application_Status, Member, Application, Employee, EmployeeLevel, Project_Status } from "@/utils/types";
import * as applicationService from "@/app/student_applications/application";
import { ConfirmationDialogProp } from "../components/confirmationPopup";

interface UseApplicationProps {
  project_id: number;
  employeeInfo: Employee;
}
export const useApplications = ({ project_id, employeeInfo }: UseApplicationProps) => {
  const [isLoading, setIsLoading] = useState(true); // shows the loading icon for the entire page
  const [isRefreshingTable, setRefreshingTable] = useState(false); // controls the loading icon for the table
  // const [currentPage, setCurrentPage] = useState(1);
  const [all_applications, setAllApplications] = useState<Application[] | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Application | null>(null);

  /*states that controls the alert dialog*/
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);
  const [alertDialogProps, setAlertDialogProps] = useState<ConfirmationDialogProp | null>(null);

  /**
   * The function will load all applications for a project
   */
  const loadApplications = async () => {
    const isIntialLoad: boolean = all_applications === null; // if there are no application we assume it because its the initial load

    try {
      // if this is the first render, set the loading icon for the page,  else show the loading icon for the table
      isIntialLoad ? setIsLoading(true) : setRefreshingTable(true);
      const application_result = await applicationService.fetchApplications(project_id);
      setAllApplications(application_result);
    } catch (err) {
      setAllApplications(null);
      console.error(err);
    } finally {
      // set the loading icon for the page to false
      isIntialLoad ? setIsLoading(false) : setRefreshingTable(false); //set the control table loading icon to false
    }
  };

  /**
   *
   * @param application_id The application id to approve
   * @param project_id The project id of the application
   * @param university The university of the team
   * @returns  void but the function will update the application status to approved, create student accounts for the approved team and reject all other applications for the same project.
   */
  const handleApprove = async (application_id: number, project_id: number, university: string, team_name: string) => {
    if (!applicationService.confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2)) {
      alert("Approval requires you to be level 2+");
      return;
    }

    try {
      await applicationService.updateApplicationStatus(application_id, Application_Status.APPROVED, selectedTeam?.team_name);
    } catch (error) {
      alert(error);
    }

    try {
      await applicationService.rejectOtherApplications(application_id, project_id);
    } catch (error) {
      alert(error);
    }

    await loadApplications();

    try {
      const teamMembers = selectedTeam?.members as Member[];
      await applicationService.createStudentAccounts(teamMembers, project_id, university, team_name, application_id);
    } catch (error) {
      console.error(`Error creating student accounts:\n${error}`);
      alert(`Error creating student accounts please contact system admin`);
    }

    try {
      await applicationService.updateProjectStatus(project_id, Project_Status.AWARDED, application_id);
    } catch (error) {
      alert(error);
    }
  };
  /**
   *
   * @param application_id The application id to reject
   * @returns void but the function will update the application status to rejected and fetch the data after update
   */
  const handleReject = async (application_id: number) => {
    // Handle reject logic
    if (!applicationService.confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2)) {
      alert("Rejection requires you to be level 2+");
      return;
    }
    try {
      await applicationService.updateApplicationStatus(application_id, Application_Status.REJECTED, selectedTeam?.team_name);
    } catch (error) {
      alert(error);
    }

    await loadApplications();
  };

  /**
   *
   * @param application_id The application id to set to pending
   * @returns void but the function will update the application status to pending and fetch the data after update
   */
  const handlePending = async (application_id: number) => {
    // Handle pending logic
    if (!applicationService.confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2)) {
      alert("Set application to pending requires you to be level 2+");
      return;
    }
    try {
      await applicationService.updateApplicationStatus(application_id, Application_Status.PENDING, selectedTeam?.team_name);
    } catch (error) {
      alert(error);
    }

    await loadApplications();
  };

  /**
   *
   * @param application_id The application id to delete
   * @returns void but the function will delete the application and fetch the data after deletion
   */
  const handleDeleteApplication = async (application_id: number) => {
    // Handle delete logic
    if (!applicationService.confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2)) {
      alert("Deleting an application requires you to be level 2+");
      return;
    }
    if (selectedTeam?.status === Application_Status.APPROVED) {
      alert("Can't delete an application that is already approved");
      return;
    }

    try {
      await applicationService.deleteApplication(application_id);
    } catch (error) {
      alert(error);
    }

    await loadApplications();
  };
  const handleConfrimDeleteAllApps = async () => {
    try {
      await applicationService.deleteAllApps(project_id);
    } catch (error) {
      alert(error);
    } finally {
      setAlertDialogOpen(false);
      await loadApplications();
    }
  };

  async function handleDeleteAllApps() {
    if (!applicationService.confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2)) {
      alert("Deleting all applications requires you to be level 2+");
      return;
    }

    // set the properties for the confirmation dialog
    setAlertDialogProps({
      title: "Confirm Delete All",
      description: (
        <>
          Are you sure you want to <span className="underline">delete all</span> unapproved applications? <br />
          This action cannot be undone.
        </>
      ),
      confirmationLabel: "Delete",
      onConfirm: () => {
        handleConfrimDeleteAllApps();
      },
      onCancel: () => {
        setAlertDialogOpen(false);
      },
    });
    setAlertDialogOpen(true);
  }
  useEffect(() => {
    loadApplications();
  }, []);

  return {
    isLoading,
    isRefreshingTable,
    all_applications,
    selectedTeam,
    setSelectedTeam,
    handleApprove,
    handleReject,
    handlePending,
    handleDeleteApplication,
    handleDeleteAllApps,
    alertDialogOpen,
    setAlertDialogOpen,
    alertDialogProps,
    setAlertDialogProps,
  };
};
