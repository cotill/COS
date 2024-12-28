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
  { id: 1, name: 'WaterBears Project', department: 'Environmental Science', date: '2023-05-15', status: 'DRAFT' },
  { id: 2, name: 'ChessPunch AI', department: 'Computer Science', date: '2023-06-01', status: 'DRAFT' },
  { id: 3, name: 'FastCode Compiler', department: 'Software Engineering', date: '2023-06-15', status: 'DRAFT' },
  { id: 4, name: 'DataMiners Analytics', department: 'Data Science', date: '2023-07-01', status: 'DRAFT' },
  { id: 5, name: 'CloudNine Infrastructure', department: 'Cloud Computing', date: '2023-07-15', status: 'DRAFT' },
  { id: 6, name: 'QuantumLeap Computing', department: 'Quantum Physics', date: '2023-08-01', status: 'DRAFT' },
  { id: 7, name: 'NeuralNet Research', department: 'Artificial Intelligence', date: '2023-08-15', status: 'DRAFT' },
  { id: 8, name: 'CyberShield Security', department: 'Cybersecurity', date: '2023-09-01', status: 'DRAFT' },
  { id: 9, name: 'BioTech Innovations', department: 'Biotechnology', date: '2023-09-15', status: 'DRAFT' },
  { id: 10, name: 'EcoSolutions Initiative', department: 'Environmental Engineering', date: '2023-10-01', status: 'DRAFT' },
  { id: 11, name: 'Bridge Design', department: 'Civil Engineering', date: '2024-10-01', status: 'DRAFT' },
]

export function ProjectsList({ searchTerm, filter }: { searchTerm: string, filter: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const projectsPerPage = 4;

  const handleSort = (column: 'date' | 'name') => {
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    const valueA = a[sortColumn as keyof typeof a];
    const valueB = b[sortColumn as keyof typeof b];

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredProjects = sortedProjects.filter((project) =>
    project[filter as keyof typeof project]
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const currentProjects =
    filteredProjects.length > 0
      ? filteredProjects.slice(
          (currentPage - 1) * projectsPerPage,
          currentPage * projectsPerPage
        )
      : [];

  return (
    <div className="space-y-4 rounded-3xl mt-4 p-4" style={{ backgroundColor: '#c9c7ce' }}>
      <Table>
        <TableHeader>
          <TableRow style={{backgroundColor: '#1d1b23' }}>
            <TableHead onClick={() => handleSort('date')} className="cursor-pointer rounded-tl-2xl rounded-bl-2xl">
              {sortColumn === 'date' 
                ? `Date ${sortOrder === 'asc' ? '▲' : '▼'}` 
                : 'Date ▲▼'}
            </TableHead>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
              {sortColumn === 'name' 
                ? `Project Name ${sortOrder === 'asc' ? '▲' : '▼'}` 
                : 'Project Name ▲▼'}
            </TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="rounded-tr-2xl rounded-br-2xl">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProjects.length > 0 ? (
            currentProjects.map((project, index) => (
              <TableRow
                key={project.id}
                style={{
                  backgroundColor: index % 2 === 0 ? 'white' : 'grey',
                  color: index % 2 === 0 ? 'black' : 'white',
                }}
              >
                <TableCell style={{ borderTopLeftRadius: '1.5rem', borderBottomLeftRadius: '1.5rem' }}>
                  {project.date}
                </TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.department}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell style={{ borderTopRightRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}>
                  <Button variant="outline" asChild>
                    <Link href={`/Employee/Projects/${project.id}`}>View Details</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                No matching projects
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

