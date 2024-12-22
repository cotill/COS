'use client'

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react';
import { Dialog } from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { TeamDetailsDialog } from './team-detail';
import { Application_Status, Universities, Member,Application, Employee } from '@/utils/types';
import { UserRole } from "@/utils/types";
import {v4 as uuidv4 } from "uuid"
interface ApplicationListProps {
  projectId: string,
  employeeInfo: Employee
}
export default function ApplicationList({projectId, employeeInfo}:ApplicationListProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const applicationsPerPage = 5
    const [projectApplications, setProjectApplications] = useState<Application[] | null> (null);
    const totalPages = projectApplications ? Math.ceil(projectApplications.length / applicationsPerPage) : 0
  
    const indexOfLastApplication = currentPage * applicationsPerPage
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage
    const currentApplications = projectApplications ? projectApplications.slice(indexOfFirstApplication, indexOfLastApplication) : []

    const [selectedTeam, setSelectedTeam] = useState<Application | null>(null)

    const fetchApplications = async() =>{
      setIsLoading(true);
      const supabase = createClient();
      const {data, error} = await supabase.from("Applications").select("*").eq('"project_id"',projectId); 
      if (error) {
        console.error("Error fetching applicaionts", error.message);
        setProjectApplications(null);
      }else{
        setProjectApplications(data);
      }
      setIsLoading(false);
    };

    useEffect(() => {
      fetchApplications();
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
      const supabase =  createClient();
      const {error} = await supabase.from('Applications').update({status: Application_Status.APPROVED}).eq('application_id',application_id);
      if(error){
        alert(`Error approving ${selectedTeam?.team_name} application! Please contact Admin`)
      }
      // change the other applications for the same project to rejected
      await rejectAllExcept(application_id,project_id)
    
      // fetch the data aftger update
      await fetchApplications();

      // create a func to create student accounts
      await createStudentAccounts(application_id, university);
    }

    async function createStudentAccounts(application_id: number, uni: string){
      let errorMessage = "";
      console.log("inside createStudentAccount func")
      const supabase =  createClient();
      const members = selectedTeam?.members as Member[];
      const teamId= uuidv4();

      members.map(async (member) => {
        const {data, error} = await supabase.auth.signUp({
          email: member.email,
          password: "teamPasswordIsLong".toString(),
          options: {
            data: {
              project_id: projectId,
              team_id: teamId,
              user_role: UserRole.STUDENT,
              full_name: member.full_name,
              major: member.major,
              university: uni
            }
          },
          
        })
        if (error) {
            errorMessage += error.name + "\n";
        };
      });

      if (errorMessage) {
        console.log(`Error creating student accounts: ${errorMessage}`);

        alert(`Error creating student accounts: ${errorMessage}`);
      }
    }
    /**
     * This function will reject all applications for a project except the application id provided
     */
    const rejectAllExcept = async (application_id: number, project_id: number) => {
      const supabase =  createClient();
      const {error} = await supabase.from('Applications')
      .update({status: Application_Status.REJECTED})
      .eq("project_id", project_id)
      .neq('application_id', application_id);
      if(error){
        alert(`Error updating other applications statsus to REJECTED! Please contact Admin`)
      }
    }
  
    const handleReject = async (application_id: number) => {
      // Handle reject logic
      if (!authUserFunctionality()) {
        alert("Rejection requires you to be level 2+");
        return;
      }
      console.log('Rejected team:', application_id);
      const supabase =  createClient();
      const {error} = await supabase.from('Applications').update({status: Application_Status.REJECTED}).eq('application_id',application_id);
      if(error){
        alert(`Error rejecting ${selectedTeam?.team_name} application! Please contact Admin`)
      }

      // fetch the data aftger update
      fetchApplications();
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
                    ${applicant.status === Application_Status.REJECTED ? "bg-red-400 text-white" : ""}`
                  }
                >
                  {applicant.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" onClick={() =>setSelectedTeam(applicant)}>
                    View Detail
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost">
                    <Trash/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink 
                href="#" 
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

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
