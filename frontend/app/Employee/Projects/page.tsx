'use client'

import { useState } from 'react';
import { ProjectsList } from '@/components/employeeComponents/ProjectList';
import Headingbar from '@/components/employeeComponents/Headingbar';
import { SearchBar } from '@/components/employeeComponents/Searchbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProjectPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('name'); // Default filter is by name
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = event.target.value;

    // Reset date range if the filter changes from "date" to something else
    if (filter == 'date' && newFilter !== 'date') {
      setDateRange({ startDate: null, endDate: null });
    }

    setSearchTerm('');
    setFilter(newFilter);
  };

  const handleDateRangeChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    setDateRange(range);
  };

  return (
    <>
      <Headingbar text="Projects" />
      <div className="pt-4 space-y-4">
        <div className="flex justify-between">
          <SearchBar
            value={searchTerm}
            onSearchChange={handleSearchChange}
            filter={filter}
            onFilterChange={handleFilterChange}
            dateRange={dateRange} // Pass the date range to the SearchBar
            onDateRangeChange={handleDateRangeChange} // Pass the handler to update the date range
          />
          <Button
            style={{
              backgroundColor: "#81c26c",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              width: "17.5%",
              borderRadius: "20px",
            }}
          >
            <Link href={`/Employee/CreateProject/`}>Create Project</Link>
          </Button>
        </div>
        <ProjectsList searchTerm={searchTerm} filter={filter} dateRange={dateRange} />
      </div>
    </>
  );
}
