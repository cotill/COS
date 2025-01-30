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
import { ConfirmationDialog, ConfirmationDialogProp } from "../confirmationPopup";
import { AlertDialog } from "../ui/alert-dialog";
import { confirmEmployeeAuthorization } from "@/app/project_applications_util/application";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ApplicationTableProps = {
  currentApplications: Application[] | [];
  onViewDetails: (newValue: Application | null) => void;
  onDeleteApplication: (application_id: number) => void;
  employeeInfo: Employee;
  isRefreshingTable: boolean;
  // filter: string;
  selectedStatus: Application_Status[];
  handleClearFilters: () => void;
  handleSelectStatus: (option: Application_Status) => void;
  sortOrder: 'asc' | 'desc';
  handleSortOrder: (order: 'asc' | 'desc') => void;
  handleSort: (column: keyof Application) => void;
  sortColumn: keyof Application;
};

const statusColors:{[key: string]: string} = {
  APPROVED: "bg-green-500/10 hover:bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/10 hover:bg-red-500/20 text-red-400", 
  PENDING: "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
}
function ApplicationTable({currentApplications,onViewDetails,onDeleteApplication, employeeInfo, isRefreshingTable, selectedStatus, handleClearFilters, handleSelectStatus, sortOrder, handleSortOrder, handleSort, sortColumn}: ApplicationTableProps) {

  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);
  const [alertDialogProps, setAlertDialogProps] = useState<ConfirmationDialogProp | null>(null);

  /*Filtering and searching applications */
  const statusOptions = Object.values(Application_Status);

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

      const application_team_name = currentApplications.find(application => application.application_id === application_id)?.team_name;
      // set the properties for the confirmation dialog
      setAlertDialogProps({
        title: "Confirm Delete",
        description: (<>Are you sure you want to delete <span className="font-bold">{application_team_name}</span> application? <br />
          This action cannot be undone.</>),
        confirmationLabel: "Delete",
        onConfirm: () => {
          handleConfirmDelete(application_id)
        },
        onCancel:() => {handleCancelDelete()}
      });
      setAlertDialogOpen(true);// open the confirmation dialog
  }

  /**
   * This function will delete the application if the user confirms the delete
   */
  const handleConfirmDelete = (application_id: number) => {
    onDeleteApplication(application_id); // call to the parent function to delete the application
    setAlertDialogOpen(false);
  };

  /**
   * This function will close the confirmation dialog
   */
  const handleCancelDelete = () => {
    setAlertDialogOpen(false);
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 rounded-3xl mt-4 px-4 pb-4" style={{ backgroundColor: '#1d1b23' }}>
      {isRefreshingTable &&
        <div className="text-center text-white">Loading applications...</div>
      }
      <Table>
        <TableHeader>
          <TableRow style={{ backgroundColor: '#1d1b23' }}>
            <TableHead onClick={() => handleSort('submission_date')} className="cursor-pointer rounded-tl-2xl rounded-bl-2xl text-white">
              {sortColumn === 'submission_date'
                ? `Submission Date ${sortOrder === 'asc' ? '▲' : '▼'}`
                : 'Submission Date ▲▼'}
            </TableHead>
            <TableHead onClick={() => handleSort('team_name')} className="cursor-pointer text-white">
              {sortColumn === 'team_name'
                ? `Team Name ${sortOrder === 'asc' ? '▲' : '▼'}`
                : 'Team Name ▲▼'}
            </TableHead>
            <TableHead onClick={() => handleSort('size')} className="cursor-pointer text-white">
              {sortColumn === 'size'
                ? `Size ${sortOrder === 'asc' ? '▲' : '▼'}`
                : 'Size ▲▼'}
            </TableHead>
            <TableHead className="relative">
              {/* <DropdownFilter
                options={statusOptions}
                selectedOptions={selectedStatus}
                onSelect={(option) => { handleSelectStatus(option as Application_Status)}}
                title="Status"
                visibleProjectCount={currentApplications.length}
                height={84}
              /> */}
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="text-white pr-4 py-2 rounded flex items-center justify-between focus:outline-none"
                    onClick={() => setIsOpen((prev) => !prev)}
                  >
                    <span>Status</span>
                    <span
                      className={`ml-2 ${
                        selectedStatus.length > 0 ? 'text-[#E75973]' : 'text-white'
                      }`}
                    >
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-w-44 bg-black bg-opacity-70" onCloseAutoFocus={(e) => e.preventDefault()}>
                  {/* <DropdownMenuSeparator /> */}
                  {statusOptions.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={selectedStatus.includes(status)}
                      onCheckedChange={() => handleSelectStatus(status)}
                      className="text-white"
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
            <TableHead className="rounded-tr-2xl rounded-br-2xl">
                <button
                  className="px-4 py-2 rounded flex items-center space-x-2"
                  onClick={handleClearFilters}
                  disabled={selectedStatus.length === 0} // Disable when no filters are selected
                >
                  <span
                    className={`${selectedStatus.length === 0 ? 'text-gray-400' : 'text-white'}`}
                  >
                    Clear
                  </span>
                  <span
                    className={`${selectedStatus.length === 0 ? 'bg-gray-400 text-gray-200' : 'bg-[#E75973] text-white'
                    } rounded-full h-4 w-4 flex items-center justify-center text-[12px]`}
                  >
                    ×
                  </span>
                </button>
              </TableHead>
              <TableHead>{}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="min-w-full">
          {currentApplications.length === 0 ? (
            <TableRow>
            <TableCell colSpan={6} className="py-7 text-center text-gray-500 rounded-2xl">
                No matching Applications
              </TableCell>
            </TableRow>
            ) : 
            (
              currentApplications.map((applicant) => (
                <TableRow key={applicant.application_id} className="bg-[#413F46] text-white">
                  <TableCell className="rounded-tl-[0.5rem] rounded-bl-[0.5rem]">
                    {new Date(applicant.submission_date).toLocaleString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}).substring(0,10)}
                  </TableCell>
                  <TableCell>{applicant.team_name}</TableCell>
                  <TableCell>{applicant.size}</TableCell>
                  <TableCell>
                    <Badge
                      className={`inline-block py-[0.25rem] px-[0.75rem] rounded-[1.0rem] ${statusColors[applicant.status]}`}
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
                  <TableCell className="rounded-tr-[0.5rem] rounded-br-[0.5rem]">
                    {applicant.status !== Application_Status.APPROVED && (
                      <Button
                      variant="ghost"
                      onClick={() => handleDeleteClick(applicant.application_id, applicant.status)}
                      disabled={!confirmEmployeeAuthorization(employeeInfo.level, EmployeeLevel.LEVEL_2)}
                      >
                      <Trash />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )
          }
        </TableBody>
      </Table>
      {/* Alert Dialog will display when the user clicks the delete button */}
      <AlertDialog open={alertDialogOpen} onOpenChange={()=> setAlertDialogOpen(false)}>
        {alertDialogProps && <ConfirmationDialog {...alertDialogProps}/>}
      </AlertDialog>
    </div>
  );
}
export default ApplicationTable;