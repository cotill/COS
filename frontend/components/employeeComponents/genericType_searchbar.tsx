import { FilterConfig } from '@/hooks/useSearchBar';
import React, { useState } from 'react';
import DateRangePicker from '@/components/employeeComponents/DateRangePicker';

interface SearchBarProps<T> {
  value: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  currentFilter: FilterConfig<T>;
  filterConfigs: FilterConfig<T>[];
  onFilterChange: (filter: FilterConfig<T>) => void;
  dateRange:{startDate: Date | null, endDate: Date | null}
  onDateRangeChange: (dateRange: {startDate: Date | null, endDate: Date | null}) => void;
}

export function SearchBar<T>({ value, onSearchChange, currentFilter,  filterConfigs,onFilterChange,
  dateRange,
  onDateRangeChange
}: SearchBarProps<T>)
{
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = filterConfigs.find(filter => filter.key.toString() === event.target.value);
    if (newFilter) {
      onFilterChange(newFilter);
    }
  };
  const [showDatePicker, setShowDatePicker] = useState(false);
  return (
    <div className="relative flex items-center border rounded-3xl shadow-md bg-white w-[80%]">
      <select
        value={currentFilter.key.toString()}
        onChange={ (event)=> {handleFilterChange(event); setShowDatePicker(event.target.value === 'date');}}
        className="border-r px-5 py-2 text-gray-700 outline-none cursor-pointer" style={{backgroundColor: 'white', borderTopLeftRadius: 20, borderBottomLeftRadius: 20, color: 'grey' }}
      >
          {filterConfigs.map((filter) => (
            <option key={filter.key.toString()} value={filter.key.toString()}>
              {filter.label}
            </option>
          ))}
      </select>
      {currentFilter.type === 'date' ? (
        <div className="relative flex items-center px-4 py-2 w-full">
          <DateRangePicker
            startDate={dateRange.startDate || null}
            endDate={dateRange.endDate || null}
            onStartDateChange={(date) =>
              onDateRangeChange({ ...dateRange, startDate: date })
            }
            onEndDateChange={(date) =>
              onDateRangeChange({ ...dateRange, endDate: date })
            }
          />
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={onSearchChange}
          className="px-4 py-2 outline-none rounded-3xl w-full"
          placeholder={`Search by ${currentFilter.label}...`}
        />
      )}
    </div>
  );
};
