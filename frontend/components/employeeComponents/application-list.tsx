'use client'

import { useState } from 'react'
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
import { Application_Status, Universities, Member,Application } from '@/utils/types';

interface ApplicationListProps {
  projectId: string,
  projectApplications: Application[] | null
}
export default function ApplicationList({projectId, projectApplications}:ApplicationListProps) {
  if (projectApplications == null){
    return     <div className="space-y-4">
      Error retrieving applications for project with project id {projectId}! Please contact system admin
    </div>
  }    
    const [currentPage, setCurrentPage] = useState(1)
    const applicationsPerPage = 5
    const totalPages = Math.ceil(projectApplications.length / applicationsPerPage)
  
    const indexOfLastApplication = currentPage * applicationsPerPage
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage
    const currentApplications = projectApplications.slice(indexOfFirstApplication, indexOfLastApplication)

    const [selectedTeam, setSelectedTeam] = useState<Application | null>(null)

    const handleApprove = (teamId: number) => {
      // Handle approve logic
      console.log('Approved team:', teamId)
    }
  
    const handleReject = (teamId: number) => {
      // Handle reject logic
      console.log('Rejected team:', teamId)
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
