import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Application, Application_Status } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

type ApplicationTableProps = {
  currentApplications: Application[] | [];
  onViewDetails: (newValue: Application | null) => void;
  onDeleteApplication: (application_id: number) => void;
};
function ApplicationTable({currentApplications,onViewDetails,onDeleteApplication}: ApplicationTableProps) {
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
                <Button
                  variant="ghost"
                  onClick={() => onDeleteApplication(applicant.application_id)}
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
export default ApplicationTable;
