import { useState, useRef, useEffect } from 'react';

type ProjectFilterProps = {
  options: string[];
  selectedOptions: string[];
  onSelect: (option: string) => void;
  title: string;
  visibleProjectCount: number;
};

export function DropdownFilter({
  options,
  selectedOptions,
  onSelect,
  title,
  visibleProjectCount,
}: ProjectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const projectRowHeight = 72; // Fixed height per project row
  const dynamicMaxHeight = visibleProjectCount * projectRowHeight;
  const fallbackHeight = 72;
  const maxHeight = `${Math.min(dynamicMaxHeight || fallbackHeight, 300)}px`;

  // Calculate the width based on the widest option
  useEffect(() => {
    if (dropdownRef.current) {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.whiteSpace = 'nowrap';
      document.body.appendChild(tempDiv);

      let maxWidth = 0;
      options.forEach((option) => {
        tempDiv.textContent = option;
        const optionWidth = tempDiv.getBoundingClientRect().width;
        maxWidth = Math.max(maxWidth, optionWidth);
      });

      tempDiv.textContent = title; // Account for title width
      maxWidth = Math.max(maxWidth, tempDiv.getBoundingClientRect().width);

      document.body.removeChild(tempDiv);
      setDropdownWidth(maxWidth + 28); // Add padding for better alignment
    }
  }, [options, title]);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      style={{ width: `${dropdownWidth}px` }} // Set the dynamic width
    >
      <button
        className="text-white pr-4 py-2 rounded flex items-center justify-between"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <span className="ml-2">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div
          className="absolute bg-white border rounded shadow p-2 mt-1 z-10 w-full"
          style={{
            maxHeight: maxHeight,
            overflowY: 'auto',
          }}
        >
          {options.map((option) => (
            <label key={option} className="block cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => onSelect(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
