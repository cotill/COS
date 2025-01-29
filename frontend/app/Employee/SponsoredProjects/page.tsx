'use client'

import { useState } from 'react';
import Headingbar from "@/components/employeeComponents/Headingbar";
import { SponsoredList } from '@/components/employeeComponents/SponsoredList';
import { SponsoredSearch } from '@/components/employeeComponents/SponsoredSearch';

export default function sponsoredprojectspage(){
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('name');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  return (
    <>
      <Headingbar
        text='Sponsored Projects'
      />
      <div className="pt-4 space-y-4">
        <SponsoredSearch
          value={searchTerm}
          onSearchChange={handleSearchChange}
          filter={filter} 
          onFilterChange={handleFilterChange} 
          placeholder={`Search by project ${filter}...`}
        />
        <SponsoredList searchTerm={searchTerm} filter={filter}/>
      </div>
    </>
  );
}