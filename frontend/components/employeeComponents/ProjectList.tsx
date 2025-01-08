'use client'

import { useState, useEffect } from 'react'
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

import { createClient } from '@/utils/supabase/client'
import { DropdownFilter } from '@/components/employeeComponents/Projectfilter';
import { Department_Types } from '@/utils/types';
import { Project_Status } from '@/utils/types';

type Project = {
  id: string;
  date: string;
  name: string;
  department: string;
  status: string;
};

export function ProjectsList({ searchTerm, filter }: { searchTerm: string; filter: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const departmentOptions = Object.values(Department_Types);
  const statusOptions = Object.values(Project_Status);

  const fetchProjects = async () => {
    // console.log('Fetching projects...');
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Projects')
        .select('project_id, created_date, title, department, status');
  
      if (error) {
        console.error('Error fetching projects:', error);
      } else if (data) {
        // console.log('Fetched projects:', data);
        setProjects(
          data.map((project) => ({
            id: project.project_id,
            date: project.created_date,
            name: project.title,
            department: project.department,
            status: project.status,
          }))
        );
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchProjects();
  }, []);

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
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredProjects = sortedProjects.filter((project) => {
    const matchesDepartment =
      selectedDepartments.length === 0 ||
      selectedDepartments.includes(project.department);
    const matchesStatus =
      selectedStatus.length === 0 ||
      selectedStatus.includes(project.status);
    const matchesSearchTerm = project[filter as keyof Project]
      ?.toString()
      ?.toLowerCase()
      ?.includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesStatus && matchesSearchTerm;
  });

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const currentProjects =
    filteredProjects.length > 0
      ? filteredProjects.slice(
          (currentPage - 1) * projectsPerPage,
          currentPage * projectsPerPage
        )
      : [];

  const handleClearFilters = () => {
    setSelectedDepartments([]);
    setSelectedStatus([]);
  };
      
  return (
    <div className="space-y-4 rounded-3xl mt-4 p-4" style={{ backgroundColor: '#c9c7ce' }}>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: '#1d1b23' }}>
                <TableHead onClick={() => handleSort('date')} className="cursor-pointer rounded-tl-2xl rounded-bl-2xl text-white">
                  {sortColumn === 'date'
                    ? `Date ${sortOrder === 'asc' ? '▲' : '▼'}`
                    : 'Date ▲▼'}
                </TableHead>
                <TableHead onClick={() => handleSort('name')} className="cursor-pointer text-white">
                  {sortColumn === 'name'
                    ? `Project Name ${sortOrder === 'asc' ? '▲' : '▼'}`
                    : 'Project Name ▲▼'}
                </TableHead>
                <TableHead>
                  <DropdownFilter
                    options={departmentOptions}
                    selectedOptions={selectedDepartments}
                    onSelect={(option) => {
                      setSelectedDepartments((prev) =>
                        prev.includes(option)
                          ? prev.filter((item) => item !== option)
                          : [...prev, option]
                      );
                    }}
                    title="Department"
                    visibleProjectCount={currentProjects.length}
                  />
                </TableHead>
                <TableHead>
                  <DropdownFilter
                    options={statusOptions}
                    selectedOptions={selectedStatus}
                    onSelect={(option) => {
                      setSelectedStatus((prev) =>
                        prev.includes(option)
                          ? prev.filter((item) => item !== option)
                          : [...prev, option]
                      );
                    }}
                    title="Status"
                    visibleProjectCount={currentProjects.length}
                  />
                </TableHead>
                <TableHead className="rounded-tr-2xl rounded-br-2xl">
                  <button
                    className="px-4 py-2 rounded"
                    onClick={handleClearFilters}
                    disabled={selectedDepartments.length === 0 && selectedStatus.length === 0} // Disable when no filters are selected
                  >
                    <span className={`${selectedDepartments.length === 0 && selectedStatus.length === 0 ? 'text-gray-400' : 'text-white'}`}>
                      Clear
                    </span>
                    <span className={`ml-2 font-bold ${selectedDepartments.length === 0 && selectedStatus.length === 0 ? 'text-gray-400' : 'text-[#E75973]'}`}>
                      ⓧ
                    </span>
                  </button>
                </TableHead>
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
                    <TableCell 
                      style={{ 
                        borderTopLeftRadius: '1.5rem', 
                        borderBottomLeftRadius: '1.5rem'
                      }}
                    >
                      {project.date.substring(0, 10)}
                    </TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.department}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell
                      style={{
                        borderTopRightRadius: '1.5rem',
                        borderBottomRightRadius: '1.5rem',
                      }}
                    >
                      <Button variant="outline" asChild>
                        <Link href={`/Employee/Projects/${project.id}`}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-7 text-center text-gray-500 rounded-2xl">
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
        </>
      )}
    </div>
  );
}
