import React from 'react';
import DatePicker from 'react-datepicker'; //npm install react-datepicker --save
import "@/components/employeeComponents/DateRangePicker.css";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  // Function to handle setting the end date to 23:59:59
  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      // Set the time to 23:59:59 for the end date
      date.setHours(23, 59, 59, 999);
    }
    onEndDateChange(date);  // Pass the modified end date back
  };

  // Function to handle setting the start date to 00:00:00
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      // Set the time to 00:00:00 for the start date
      date.setHours(0, 0, 0, 0);
    }
    onStartDateChange(date);  // Pass the modified start date back
  };

  return (
    <div className="flex items-center space-x-2">
      <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        dateFormat="yyyy-MM-dd"
        placeholderText="Start Date"
        showPopperArrow={false}
        isClearable
        className='w-full text-black'
      />
      <DatePicker
        selected={endDate}
        onChange={handleEndDateChange}  // Handle end date with 23:59:59
        dateFormat="yyyy-MM-dd"
        placeholderText="End Date"
        showPopperArrow={false}
        isClearable
        className='w-full text-black'
      />
    </div>
  );
};

export default DateRangePicker;
