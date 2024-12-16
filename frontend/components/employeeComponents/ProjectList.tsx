'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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

const projects = [
  { id: 1, name: 'WaterBears Project', department: 'Environmental Science', date: '2023-05-15' },
  { id: 2, name: 'ChessPunch AI', department: 'Computer Science', date: '2023-06-01' },
  { id: 3, name: 'FastCode Compiler', department: 'Software Engineering', date: '2023-06-15' },
  { id: 4, name: 'DataMiners Analytics', department: 'Data Science', date: '2023-07-01' },
  { id: 5, name: 'CloudNine Infrastructure', department: 'Cloud Computing', date: '2023-07-15' },
  { id: 6, name: 'QuantumLeap Computing', department: 'Quantum Physics', date: '2023-08-01' },
  { id: 7, name: 'NeuralNet Research', department: 'Artificial Intelligence', date: '2023-08-15' },
  { id: 8, name: 'CyberShield Security', department: 'Cybersecurity', date: '2023-09-01' },
  { id: 9, name: 'BioTech Innovations', department: 'Biotechnology', date: '2023-09-15' },
  { id: 10, name: 'EcoSolutions Initiative', department: 'Environmental Engineering', date: '2023-10-01' },
  { id: 10, name: 'Bridge Design', department: 'Civil Engineering', date: '2024-10-01' },

]

interface Project {
  id: string
  name: string
  department: string
  createdAt: string
}

interface ProjectsListProps {
  initialProjects: Project[]
}

export function ProjectsList() {
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 5
  const totalPages = Math.ceil(projects.length / projectsPerPage)

  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject)

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.department}</TableCell>
              <TableCell>{project.date}</TableCell>
              <TableCell>
                <Button variant="outline" asChild>
                  <Link href={`/Employee/Projects/${project.id}`}>View Details</Link>
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
    </div>
  )
}

