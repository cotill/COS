"use client";

import { Dialog } from "@/components/ui/dialog";
import { TeamDetailsDialog } from "./team-detail";
import { Application, Application_Status, Employee } from "@/utils/types";
import ApplicationTable from "./applicationTable";
import { ApplicationPagination } from "./applicationPagination";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmationDialog } from "../confirmationPopup";
import { AlertDialog } from "../ui/alert-dialog";
import { useApplications } from "@/hooks/useApplication";
import { useSearchBar, FilterConfig } from "@/hooks/useSearchBar";
import { useState } from "react";
import { SearchBar } from "./genericType_searchbar";
interface ApplicationListProps {
  projectId: number;
  employeeInfo: Employee;
}
export default function ApplicationList({ projectId, employeeInfo }: ApplicationListProps) {
  const {
    isLoading,
    isRefreshingTable,
    all_applications,
    selectedTeam,
    setSelectedTeam,
    handleApprove,
    handleReject,
    handlePending,
    handleDeleteApplication,
    handleDeleteAllApps,
    alertDialogOpen,
    setAlertDialogOpen,
    alertDialogProps,
  } = useApplications({ project_id: projectId, employeeInfo });

  const filterConfigs: FilterConfig<Application>[] = [
    {
      key: "submission_date",
      type: "date",
      label: "Submission Date",
    },
    {
      key: "team_name",
      type: "text",
      label: "Team Name",
    },
    {
      key: "size",
      type: "text",
      label: "Team Size",
    },
  ];
  const { searchTerm, currentFilter, dateRange, handleSearchChange, handleFilterChange, handleDateRangeChange, filterData } = useSearchBar(filterConfigs[0], filterConfigs);

  const [sortColumn, setSortColumn] = useState<keyof Application>("submission_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const statusOptions = Object.values(Application_Status);
  const [selectedStatus, setSelectedStatus] = useState<Application_Status[]>([]);

  // sort applications
  const sortedApplications = all_applications
    ? [...all_applications].sort((applicationA, applicationB) => {
        const valueA = applicationA[sortColumn as keyof Application];
        const valueB = applicationB[sortColumn as keyof Application];
        if (valueA == null || valueB == null) return 0;
        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      })
    : [];

  // Apply filters
  const filteredApplications = filterData(sortedApplications, selectedStatus);

  //pagination
  const applicationsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = filteredApplications ? Math.ceil(filteredApplications.length / applicationsPerPage) : 0;
  const currentApplications = filteredApplications ? filteredApplications.slice((currentPage - 1) * applicationsPerPage, currentPage * applicationsPerPage) : [];

  // handler functions
  const handleSort = (column: keyof Application) => {
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleClearFilters = () => {
    setSelectedStatus([]);
  };

  function handleSortOrder(order: "asc" | "desc") {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setSortOrder(order);
  }

  function handleSelectStatus(option: Application_Status) {
    setSelectedStatus((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]));
  }
  const isAnyApplicationApproved = all_applications?.some((application) => application.status === Application_Status.APPROVED);

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }
  if (all_applications == null) {
    return <div className="space-y-4 text-white">Error retrieving applications for project with project id {projectId}! Please contact system admin</div>;
  }

  return (
    <>
      <div className="pt-4 space-y-4">
        <div className="flex justify-between">
          <SearchBar
            value={searchTerm}
            onSearchChange={handleSearchChange}
            currentFilter={currentFilter}
            filterConfigs={filterConfigs}
            onFilterChange={handleFilterChange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
          <Button
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              width: "",
              borderRadius: "20px",
            }}
            className="bg-red-400 hover:bg-red-500 flex items-center space-x-4"
            onClick={() => {
              handleDeleteAllApps();
            }}
          >
            <span>Delete All</span>
            <Trash2 />
          </Button>
        </div>
        <div className="space-y-4">
          {/* Displays the application table */}
          <ApplicationTable
            currentApplications={currentApplications}
            onViewDetails={setSelectedTeam}
            onDeleteApplication={handleDeleteApplication}
            employeeInfo={employeeInfo}
            isRefreshingTable={isRefreshingTable}
            selectedStatus={selectedStatus}
            handleClearFilters={handleClearFilters}
            handleSelectStatus={handleSelectStatus}
            sortOrder={sortOrder}
            handleSortOrder={handleSortOrder}
            handleSort={handleSort}
            sortColumn={sortColumn}
          />
          {/* Display the pagination */}
          <ApplicationPagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page: number) => setCurrentPage(page)} />

          {/* Display the team application*/}
          <Dialog open={selectedTeam !== null} onOpenChange={() => setSelectedTeam(null)}>
            <TeamDetailsDialog
              team={selectedTeam}
              onClose={() => setSelectedTeam(null)}
              onApprove={isAnyApplicationApproved ? undefined : handleApprove}
              onReject={isAnyApplicationApproved ? undefined : handleReject}
              onPending={isAnyApplicationApproved ? undefined : handlePending}
            />
          </Dialog>
        </div>
        {/* Alert Dialog will display when the user clicks the deleteAll button */}
        <AlertDialog open={alertDialogOpen} onOpenChange={() => setAlertDialogOpen(false)}>
          {alertDialogProps && <ConfirmationDialog {...alertDialogProps} />}
        </AlertDialog>
      </div>
    </>
  );
}
