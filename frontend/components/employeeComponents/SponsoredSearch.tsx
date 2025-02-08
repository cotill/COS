import React from 'react';

interface SponsoredSearchProps {
  value: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filter: string;
  onFilterChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
}

export const SponsoredSearch: React.FC<SponsoredSearchProps> = ({ 
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
        className="border-r px-5 py-2 text-gray-700 outline-none cursor-pointer" style={{backgroundColor: 'white', borderTopLeftRadius: 20, borderBottomLeftRadius: 20, color: 'grey' }}
      >
        <option value="name">Project Name</option>
        <option value="team">Team Name</option>
        <option value="member">Team Member</option>
        <option value="email">Personal Email</option>
        <option value="ttg" disabled>TTG Email</option>
      </select>
      <input
        type="text"
        value={value}
        onChange={onSearchChange}
        className="px-4 py-2 outline-none rounded-3xl w-full text-black"
        placeholder={placeholder}
      />
    </div>
  );
};
