import { useState, useEffect, useRef } from "react";

interface DropdownMenuProps {
  title?: string;
  options: string[];
  onSelect?: (value: string) => void;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  title = "Select",
  options = [],
  onSelect,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(title);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(title);
  }, [title]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div
      ref={ref}
      className={`flex flex-col w-25 text-sm relative z-[9999] ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full text-left px-4 pr-2 py-2 border rounded bg-white/5 border-gray-300 shadow-sm focus:outline-none"
      >
        <span>{selected}</span>
        <svg
          className={`w-5 h-5 inline float-right transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="w-full bg-white/5 border border-gray-300 rounded shadow-md mt-1 py-2 z-[9999] absolute top-full left-0 backdrop-blur-md">
          {options.map((option) => (
            <li
              key={option}
              className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer transition-colors duration-150"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
