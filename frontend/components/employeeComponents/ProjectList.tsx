// Full code with "company" filtering and display support added (with department/status color badges preserved)
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { createClient } from "@/utils/supabase/client";
import { Department_Types, Project_Status } from "@/utils/types";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const companyOptions = ["TTG", "FEC"];

export function ProjectsList({
  searchTerm,
  filter,
  dateRange,
  userLevel
}: {
  searchTerm: string;
  filter: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
  userLevel: number;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<"date" | "name" | "term">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [sponsorToggle, setSponsorToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isOpenS, setIsOpenS] = useState(false);
  const [isOpenD, setIsOpenD] = useState(false);

  const supabase = createClient();

  const departmentOptions = Object.values(Department_Types);
  const statusOptions = Object.values(Project_Status);

  const departmentColors: { [key: string]: string } = {
    ENGINEERING: "#FFA767",
    COMPUTER_SCIENCE: "#63B3FF",
    BIOMEDICAL: "#E75973",
    SUSTAINABILITY: "#81C26C",
  };

  const statusColors: { [key: string]: string } = {
    NEW: "#788292",
    DRAFT: "white",
    REVIEW: "#D7B634",
    APPROVED: "#81C26C",
    REJECTED: "#E75973",
    DISPATCHED: "#000080",
    AWARDED: "#4B006E",
    ACTIVE: "#008080",
    COMPLETED: "#154406",
    CANCELLED: "black",
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Projects")
        .select("project_id, created_date, title, department, status, sponsor_email, start_term, Company");

      if (data) {
        setProjects(
          data.map((project) => ({
            id: project.project_id,
            date: project.created_date,
            name: project.title,
            department: project.department,
            status: project.status,
            sponsor: project.sponsor_email,
            term: project.start_term,
            company: project.Company
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSort = (column: "date" | "name" | "term") => {
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleSelectStatus = (option: string) => {
    setSelectedStatus((prev) =>
      prev.includes(option) ? prev.filter((s) => s !== option) : [...prev, option]
    );
  };

  const handleSelectDepartment = (option: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(option) ? prev.filter((s) => s !== option) : [...prev, option]
    );
  };

  const handleSelectCompany = (option: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(option) ? prev.filter((s) => s !== option) : [...prev, option]
    );
  };

  const handleClearFilters = () => {
    setSelectedDepartments([]);
    setSelectedStatus([]);
    setSelectedCompanies([]);
  };

  const handleSetSponsorToggle = () => {
    setSponsorToggle(!sponsorToggle);
  };

  const filteredProjects = [...projects]
    .sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (!valA) return sortOrder === "asc" ? -1 : 1;
      if (!valB) return sortOrder === "asc" ? 1 : -1;
      return valA < valB ? (sortOrder === "asc" ? -1 : 1) : (sortOrder === "asc" ? 1 : -1);
    })
    .filter((project) => {
      const projectDate = new Date(project.date);
      const matchesDate = (!dateRange.startDate || projectDate >= dateRange.startDate) &&
        (!dateRange.endDate || projectDate <= dateRange.endDate);
      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(project.department);
      const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(project.status);
      const matchesCompany = selectedCompanies.length === 0 || selectedCompanies.includes(project.company);
      const matchesSponsor = sponsorToggle ? project.sponsor === null : true;

      const matchesSearchTerm =
        filter === "date"
          ? true
          : searchTerm === ""
            ? true
            : (searchTerm.toLowerCase() === "t" || searchTerm.toLowerCase() === "tb" || searchTerm.toLowerCase() === "tbd") && filter === "term"
              ? !project[filter as keyof typeof project]
              : project[filter as keyof typeof project]
                ?.toString()
                ?.toLowerCase()
                ?.includes(searchTerm.toLowerCase());

      return matchesDate && matchesDepartment && matchesStatus && matchesCompany && matchesSponsor && matchesSearchTerm;
    });

  const totalPages = Math.ceil(filteredProjects.length / 10);
  const currentProjects = filteredProjects.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="space-y-1 rounded-3xl mt-4 px-4 pb-4" style={{ backgroundColor: "#1d1b23" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: "#1d1b23" }}>
                <TableHead className="text-white cursor-pointer rounded-tl-2xl rounded-bl-2xl" onClick={() => handleSort("date")}>Date</TableHead>
                <TableHead className="text-white cursor-pointer rounded-tl-2xl rounded-bl-2xl" onClick={() => handleSort("term")}>Term</TableHead>
                <TableHead className="text-white cursor-pointer rounded-tl-2xl rounded-bl-2xl" onClick={() => handleSort("name")}>Project Name</TableHead>

                <TableHead>
                  <DropdownMenu open={isOpenD} onOpenChange={setIsOpenD}>
                    <DropdownMenuTrigger asChild>
                      <button className="text-white">Department ▼</button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1D1B23]">
                      {departmentOptions.map((d) => (
                        <DropdownMenuCheckboxItem
                          key={d}
                          checked={selectedDepartments.includes(d)}
                          onCheckedChange={() => handleSelectDepartment(d)}
                          className="text-white"
                        >{d}</DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>

                <TableHead>
                  <DropdownMenu open={isOpenS} onOpenChange={setIsOpenS}>
                    <DropdownMenuTrigger asChild>
                      <button className="text-white">Status ▼</button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1D1B23]">
                      {statusOptions.map((s) => (
                        <DropdownMenuCheckboxItem
                          key={s}
                          checked={selectedStatus.includes(s)}
                          onCheckedChange={() => handleSelectStatus(s)}
                          className="text-white"
                        >{s}</DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>

                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-white">Company ▼</button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1D1B23]">
                      {companyOptions.map((c) => (
                        <DropdownMenuCheckboxItem
                          key={c}
                          checked={selectedCompanies.includes(c)}
                          onCheckedChange={() => handleSelectCompany(c)}
                          className="text-white"
                        >{c}</DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>

                <TableHead>
                  <button
                    onClick={handleClearFilters}
                    className="text-white border p-1 rounded"
                    disabled={selectedDepartments.length === 0 && selectedStatus.length === 0 && selectedCompanies.length === 0}
                  >Clear Filters</button>
                  {userLevel >= 3 && (
                    <button
                      onClick={handleSetSponsorToggle}
                      className="text-white ml-2 border p-1 rounded"
                    >Unsponsored</button>
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentProjects.map((project) => (
                <TableRow className="rounded-tr-2xl rounded-br-2xl rounded-tr-2xl rounded-br-2xl" key={project.id} style={{ backgroundColor: "#413F46", color: "white" }}>
                  <TableCell className="rounded-tl-[1rem] rounded-bl-[1rem]">{new Date(project.date).toLocaleDateString()}</TableCell>
                  <TableCell>{project.term || "TBD"}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    <div style={{
                      backgroundColor: departmentColors[project.department],
                      color: "white",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      display: "inline-block"
                    }}>{project.department}</div>
                  </TableCell>
                  <TableCell>
                    <div style={{
                      backgroundColor: statusColors[project.status],
                      color: project.status === "DRAFT" ? "black" : "white",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      display: "inline-block"
                    }}>{project.status}</div>
                  </TableCell>
                  <TableCell>{project.company}</TableCell>
                  <TableCell className="rounded-tr-[1rem] rounded-br-[1rem]">
                    <button className="outline rounded-lg p-0.5 px-2 bg-[#1D1B23]">
                    <Link href={`/Employee/Projects/${project.id}`} >Project Details</Link>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {currentProjects.length === 0 && (
                <TableRow className="rounded-tr-[1rem] rounded-br-[1rem]">
                  <TableCell colSpan={7} className="text-center text-gray-400 py-4">No matching projects</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Pagination className="text-white mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink href="#" onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
