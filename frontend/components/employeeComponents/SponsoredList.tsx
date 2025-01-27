'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
import { Project_Status } from '@/utils/types';
import TeamMenu from '@/components/employeeComponents/team-menu';

type Project = {
  id: string;
  name: string;
  team: string;
  status: string;
};

export function SponsoredList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<'team' | 'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const supabase = createClient();

  const statusOptions = Object.values(Project_Status);

  const fetchProjects = async () => {
    console.log('Fetching projects...');
    setLoading(true);
    try {
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();
    
        if (sessionError || !session) {
            console.error("Error getting session:", sessionError);
            return;
        }
    
        const userId = session.user.id;
        const { data: userData, error: userError } = await supabase
        .from("Employees")
        .select("email")
        .eq("employee_id", userId)
        .single();
    
        if (userError || !userData) {
        console.error("Error getting user data:", userError);
        return;
        }
    
        const userEmail = userData.email;
        console.log('Got user email: ', userEmail);

        const { data, error } = await supabase
            .from('Projects')
            .select('project_id, title, project_budget, status')
            .eq('sponsor_email', userEmail);
  
        if (error) {
            console.error('Error fetching projects:', error);
        } else if (data) {
            console.log('Fetched projects:', data);
            setProjects(
            data.map((project) => ({
                id: project.project_id,
                name: project.title,
                team: project.project_budget,
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

  const handleSort = (column: 'team' | 'name') => {
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
    const matchesStatus =
      selectedStatus.length === 0 ||
      selectedStatus.includes(project.status);
    return matchesStatus;
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
    setSelectedStatus([]);
  };

  const statusColors: { [key: string]: string } = {
    DRAFT: '#788292',
    REVIEW: '#D7B634',
    APPROVED: '#81C26C',
    REJECTED: '#FF6B6B',
    DISPATCHED: '#000000',
    AWARDED: '#4B006E',
    ACTIVE: '#008080',
    COMPLETED: '#154406',
    CANCELLED: 'black',
  };
      
  return (
    <div className="space-y-4 rounded-3xl mt-4 px-4 pb-4" style={{ backgroundColor: '#1d1b23' }}>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: '#1d1b23' }}>
                <TableHead onClick={() => handleSort('name')} className="cursor-pointer rounded-tl-2xl rounded-bl-2xl text-white">
                  {sortColumn === 'name'
                    ? `Project Name ${sortOrder === 'asc' ? '▲' : '▼'}`
                    : 'Project Name ▲▼'}
                </TableHead>
                <TableHead onClick={() => handleSort('team')} className="cursor-pointer text-white">
                  {sortColumn === 'team'
                    ? `Team Name (Using budget as stand in) ${sortOrder === 'asc' ? '▲' : '▼'}`
                    : 'Team Name (Using budget as stand in) ▲▼'}
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
                    height={100} 
                  />
                </TableHead>
                <TableHead className="rounded-tr-2xl rounded-br-2xl">
                  <button
                    className="px-4 py-2 rounded flex items-center space-x-2"
                    onClick={handleClearFilters}
                    disabled={ selectedStatus.length === 0} // Disable when no filters are selected
                  >
                    <span
                      className={`${
                        selectedStatus.length === 0
                          ? 'text-gray-400'
                          : 'text-white'
                      }`}
                    >
                      Clear
                    </span>
                    <span
                      className={`${
                        selectedStatus.length === 0
                          ? 'bg-gray-400 text-gray-200'
                          : 'bg-[#E75973] text-white'
                      } rounded-full h-4 w-4 flex items-center justify-center text-[12px]`}
                    >
                      ×
                    </span>
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProjects.length > 0 ? (
                currentProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    style={{
                      backgroundColor: '#413F46',
                      color: 'white',
                    }}
                  >
                    <TableCell 
                      style={{ 
                        borderTopLeftRadius: '0.5rem', 
                        borderBottomLeftRadius: '0.5rem'
                      }}
                    >
                      {project.name}
                    </TableCell>
                    <TableCell>{project.team}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          backgroundColor: statusColors[project.status],
                          display: 'inline-block',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1.0rem',
                        }}
                      >
                        {project.status}
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        borderTopRightRadius: '0.5rem',
                        borderBottomRightRadius: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button className="outline rounded-lg p-0.5">
                        <Link href={`/Employee/Projects/${project.id}`}>Project Details</Link>
                        </button>
                        <button className="outline rounded-lg p-0.5" onClick={() => setMenuOpen(!isMenuOpen)}>
                            Team Details
                        </button>
                        {isMenuOpen && (
                            <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black opacity-10 z-40"
                                onClick={() => setMenuOpen(false)} // Close modal when clicking backdrop
                            />
                            <div className="fixed top-0 right-0 z-50">
                                <TeamMenu
                                onClose={() => setMenuOpen(false)}
                                />
                            </div>
                            </>
                        )}
                    </div>
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
          <Pagination className="text-white">
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
