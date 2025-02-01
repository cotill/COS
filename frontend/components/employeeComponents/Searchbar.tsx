import React, { useState } from 'react';
import DateRangePicker from '@/components/employeeComponents/DateRangePicker';

interface SearchBarProps {
  value: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filter: string;
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
  onDateRangeChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onSearchChange,
  filter,
  onFilterChange,
  dateRange,
  onDateRangeChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getPlaceholderText = (filter: string) => {
    switch (filter) {
      case 'name':
        return 'Search project name...';
      // case 'department':
      //   return 'Search department...';
      // case 'status':
      //   return 'Search status...';
    }
  };

  return (
    <div className="relative flex items-center border rounded-3xl shadow-md bg-white w-[80%]">
      <select
        value={filter}
        onChange={(event) => {
          onFilterChange(event);
          setShowDatePicker(event.target.value === 'date');
        }}
        className="border-r px-5 py-2 text-gray-700 outline-none cursor-pointer"
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          color: 'grey',
        }}
      >
        <option value="name">Name</option>
        {/* <option value="department">Department</option> */}
        <option value="date">Date</option>
        {/* <option value="status">Status</option> */}
      </select>
      
      {showDatePicker ? (
        <div className="relative flex items-center px-4 py-2 w-full">
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
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
          placeholder={getPlaceholderText(filter)}
        />
      )}
    </div>
  );
};