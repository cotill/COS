import React from 'react';

interface SearchBarProps {
  value: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filter: string;
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onSearchChange, 
  filter, 
  onFilterChange, 
  placeholder = 'Search...' 
}) => {
  return (
    <div className="relative flex items-center border rounded-3xl shadow-md bg-white w-[80%]">
      <select
        value={filter}
        onChange={onFilterChange}
        className="appearance-none bg-transparent border-r px-5 py-2 text-gray-700 outline-none cursor-pointer"
      >
        <option value="name">Name</option>
        <option value="department">Department</option>
        <option value="date">Date</option>
      </select>
      <input
        type="text"
        value={value}
        onChange={onSearchChange}
        className="px-4 py-2 outline-none rounded-3xl w-full"
        placeholder={placeholder}
      />
    </div>
  );
};
