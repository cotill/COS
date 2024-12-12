'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Trash, ChevronLeft } from 'lucide-react';
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

interface TeamMember {
  name: string
  role: string
  specialization: string
}

interface Applicant {
  id: number
  teamName: string
  members: TeamMember[]
  status: string
}
const applications = [
    {id: 1, teamName: "waterBears", memberSize: 3, status: "pending", members: [
        { name: 'John Doe', role: 'Team Lead', specialization: 'Computer Science' },
        { name: 'Jane Smith', role: 'Developer', specialization: 'Software Engineering' },
        { name: 'Lebron James', role: 'Developer', specialization: 'Software Engineering' },
      ],
    },
    {id: 2, teamName: "fireFoxes", memberSize: 2, status: "approved", members: [
        { name: 'Alice Johnson', role: 'Team Lead', specialization: 'Computer Science' },
        { name: 'Bob Wilson', role: 'Developer', specialization: 'Software Engineering' },
      ],
    },
    {id: 3, teamName: "earthWorms", memberSize: 10, status: "rejected", members: []},
    {id: 4, teamName: "skyHawks", memberSize: 1, status: "pending",  members: []},
    {id: 5, teamName: "mountainLions", memberSize: 3, status: "approved",  members: []},
    {id: 6, teamName: "riverOtters", memberSize: 4, status: "rejected", members: []},
    {id: 7, teamName: "desertEagles", memberSize: 2, status: "pending", members: []},
    {id: 8, teamName: "forestWolves", memberSize: 8, status: "approved", members: []},
    {id: 9, teamName: "oceanSharks", memberSize: 4, status: "rejected", members: []},
    {id: 10, teamName: "jungleTigers", memberSize: 5, status: "pending", members: []},
    {id: 11, teamName: "savannahLions", memberSize: 3, status: "approved", members: []}
];
export default function ApplicationList({projectId}: {projectId: string}) {
    // use database to get the applications for that project

    const [currentPage, setCurrentPage] = useState(1)
    const applicationsPerPage = 5
    const totalPages = Math.ceil(applications.length / applicationsPerPage)
  
    const indexOfLastApplication = currentPage * applicationsPerPage
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage
    const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication)

    const [selectedTeam, setSelectedTeam] = useState<Applicant | null>(null)

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
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/Employee/Projects/${projectId}`}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Project Details
        </Link>
      </Button>
    <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Team Name</TableHead>
        <TableHead>members</TableHead>
        <TableHead>status</TableHead>
        <TableHead>action</TableHead>
        <TableHead>{}</TableHead>

      </TableRow>
      </TableHeader>
        <TableBody>
          {currentApplications.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell>{applicant.teamName}</TableCell>
              <TableCell>{applicant.memberSize}</TableCell>
              <TableCell>
              <Badge
              //  variant={
              //     applicant.status === 'approved' ? 'default' :
              //     applicant.status === 'rejected' ? 'destructive' : 'secondary'
              //   }
                className={`bg-white text-black 
                  ${applicant.status === 'approved' ? "bg-green-400 text-white" : ""}
                  ${applicant.status === 'rejected' ? "bg-red-400 text-white" : ""}`
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
