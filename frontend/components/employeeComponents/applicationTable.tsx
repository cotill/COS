import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Application, Application_Status, Employee, EmployeeLevel } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { ConfirmationDialog } from "../confirmationPopup";
import { AlertDialog } from "../ui/alert-dialog";
import { confirmEmployeeAuthorization } from "@/app/student_applications/application";

type ApplicationTableProps = {
  currentApplications: Application[] | [];
  onViewDetails: (newValue: Application | null) => void;
  onDeleteApplication: (application_id: number) => void;
  employeeInfo: Employee
};
function ApplicationTable({currentApplications,onViewDetails,onDeleteApplication, employeeInfo}: ApplicationTableProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);

  /**
   * if the employee is authorized to delete the application, this function will set the selected application id to the application id
   * @param application_id The application id to delete
   * @param application_status The status of the application
   * @returns
   */
  const handleDeleteClick = (application_id : number, application_status : Application_Status) => {
      if (!confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2)) {
        alert("Deleting an application requires you to be level 2+");
        return;
      }
      if(application_status === Application_Status.APPROVED){
        alert("Can't delete an application that is already approved");
        return;
      }
      setSelectedApplicationId(application_id);// setting this state will open the confirmation dialog
  }

  /**
   * This function will delete the application if the user confirms the delete
   */
  const handleConfirmDelete = () => {
    if (selectedApplicationId !== null){ // confirm that there was a application clicked
      onDeleteApplication(selectedApplicationId) // call to the parent function to delete the application
      setSelectedApplicationId(null);
    }
  }

  /**
   * This function will close the confirmation dialog
   */
  const handleCancelDelete = () => {
    setSelectedApplicationId(null);
  }
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>{}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentApplications.map((applicant) => (
            <TableRow key={applicant.application_id}>
              <TableCell>{applicant.team_name}</TableCell>
              <TableCell>{applicant.size}</TableCell>
              <TableCell>{applicant.submission_date}</TableCell>
              <TableCell>
                <Badge
                  className={`bg-white text-black 
                ${applicant.status === Application_Status.APPROVED ? "bg-green-400 text-white" : ""}
                ${applicant.status === Application_Status.REJECTED ? "bg-red-400 text-white" : ""}`}
                >
                  {applicant.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => onViewDetails(applicant)}
                >
                  View Detail
                </Button>
              </TableCell>
              <TableCell>
                {confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2) && applicant.status != Application_Status.APPROVED &&(
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteClick(applicant.application_id, applicant.status)}
                >
                  <Trash />
                </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Alert Dialog will display whn the user clicks the delete button */}
      <AlertDialog open={selectedApplicationId !== null} onOpenChange={()=> setSelectedApplicationId(null)}>
        <ConfirmationDialog 
          application_team_name= {currentApplications.find(application => application.application_id === selectedApplicationId)?.team_name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </AlertDialog>
    </>
  );
}
export default ApplicationTable;
