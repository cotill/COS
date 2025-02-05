"use client";

import { useState, useEffect } from 'react';
import { ProjectsList } from '@/components/employeeComponents/ProjectList';
import Headingbar from '@/components/employeeComponents/Headingbar';
import { SearchBar } from '@/components/employeeComponents/Searchbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client'

export default function ProjectPage() {
  const { employeeLevel } = useEmployee(); // Get employee level from context

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('name'); // Default filter is by name
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });
  const [userLevel, setUserLevel] = useState<number | null>(null);

  const supabase = createClient();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = event.target.value;
    if (filter === 'date' && newFilter !== 'date') {
      setDateRange({ startDate: null, endDate: null });
    }
    setSearchTerm('');
    setFilter(newFilter);
  };

  const handleDateRangeChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    setDateRange(range);
  };

  const fetchUserLevel = async () => {
    console.log('Fetching user level...');
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
  
      if (sessionError || !session) {
        console.error("Error getting session:", sessionError);
        return;
      }
  
      const { data: userData, error: userError } = await supabase
        .from("Employees")
        .select("level")
        .eq("employee_id", session.user.id)
        .single();
  
      if (userError || !userData) {
        console.error("Error getting user data:", userError);
        return;
      }
  
      const userLevel = userData.level;
      console.log('Got user level: ', userLevel);
      setUserLevel(userLevel); // Set the user level
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };
  
  useEffect(() => {
    fetchUserLevel();
  }, []);

  const isButtonDisabled = userLevel !== null && userLevel < 1; // Check if userLevel is less than 1

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
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />

          <Button
            style={{
              backgroundColor: isButtonDisabled ? "#c9c7ce" : "#81c26c", // Grey out the button if disabled
              color: "white", // Adjust text color for disabled state
              fontWeight: "bold",
              fontSize: "16px",
              width: "17.5%",
              borderRadius: "20px",
            }}
            disabled={isButtonDisabled} // Disable button if userLevel is less than 1
          >
            <Link href={`/Employee/CreateProject/`} passHref>
              Create Project
            </Link>
            <span className='bg-white isButtonDisabled ? text-[#c9c7ce] : text-[#81c26c] rounded-full h-4 w-4 ml-2 flex items-center justify-center text-[16px]'>
              +
            </span>
          </Button>
        </div>
        <ProjectsList searchTerm={searchTerm} filter={filter} dateRange={dateRange} />
      </div>
    </>
  );
}
