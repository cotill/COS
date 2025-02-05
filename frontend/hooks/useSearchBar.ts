// frontend/app/Employee/Projects/useSearchBar.ts

import { Application_Status } from '@/utils/types';
import { useState } from 'react';

export type FilterConfig<T> = {
  key: keyof T
  type: 'text' | 'date' | 'select'// select is a dropdown where you can select more than one field to filter on
  options?: string[]; // For select type
  label: string
}
type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
} 
export function useSearchBar<T extends Object>(
  defaultFilter: FilterConfig<T>, // the defualt column to filter by
  FilterConfigs: FilterConfig<T>[] // the possible columns that can be filtered by
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState<(FilterConfig<T>)>(defaultFilter); 
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (newFilter: FilterConfig<T>) => {

    // Reset date range if the filter changes from "date" to something else
    if (currentFilter.type == 'date' && newFilter.type !== 'date') {
      setDateRange({ startDate: null, endDate: null });
    }

    setSearchTerm('');// reset the search term
    setCurrentFilter(newFilter);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };
const isWithinRange = (itemDate: Date): boolean => {
  // if no date range is set, then include all dates
  if (!dateRange.startDate && !dateRange.endDate) {
    return true;
  }
  // if itemDate is not in the start range, return false
  if (dateRange.startDate) {
    if (itemDate < dateRange.startDate) {
      return false;
    }
  }
  // if itemDate is not in the end range, return false
  if (dateRange.endDate) {
    if (itemDate > dateRange.endDate) {
      return false;
    }
  }

  // if we get here, then date is within the start and end date
  return true;
}
  const filterData = (data: T[], selectedStatus: Application_Status[]) : T[] => {
    return data.filter((item) => {
      let dateInRange=true;
      if (currentFilter.type === 'date') {
        const itemDate = new Date(item[currentFilter.key] as string) // extracts the date  using the key converts it to a Date object
         dateInRange = isWithinRange(itemDate);
      }
      // else
    // Filter by search term
    const value = item[currentFilter.key];
    console.log('Value: ', value)
    console.log('Search term: ', searchTerm)
    if (value == null) return false;
    const matchesSearch = value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    console.log('Matches search: ', matchesSearch)

    // Filter by selected status (if any statuses are selected)
    const matchesStatus =
      selectedStatus.length === 0 || // If no status is selected, include all items
      selectedStatus.includes(item["status" as keyof T] as Application_Status);

    console.log('Matches status: ', matchesStatus)
    return matchesSearch && matchesStatus && dateInRange;

    });
  } 
  return {
    searchTerm,
    currentFilter,
    dateRange,
    handleSearchChange,
    handleFilterChange,
    handleDateRangeChange,
    filterData
  };
}