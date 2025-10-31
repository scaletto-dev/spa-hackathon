import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";

interface DropdownOption {
   value: string;
   label: string;
   icon?: string;
}

interface CustomDropdownProps {
   value: string;
   onChange: (value: string) => void;
   options: DropdownOption[];
   placeholder?: string;
   color?: "pink" | "purple" | "blue" | "green";
}

export function CustomDropdown({
   value,
   onChange,
   options,
   placeholder = "Select...",
   color = "pink",
}: CustomDropdownProps) {
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   const selectedOption = options.find((opt) => opt.value === value);
   const displayText = selectedOption?.label || placeholder;

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const colorClasses = {
      pink: {
         gradient: "from-white to-pink-50",
         border: "border-pink-200 hover:border-pink-300 focus:border-pink-400",
         ring: "focus:ring-pink-100",
         icon: "text-pink-500",
         menu: "border-pink-200",
         selected: "bg-pink-100 text-pink-700",
         hover: "hover:bg-pink-50",
      },
      purple: {
         gradient: "from-white to-purple-50",
         border: "border-purple-200 hover:border-purple-300 focus:border-purple-400",
         ring: "focus:ring-purple-100",
         icon: "text-purple-500",
         menu: "border-purple-200",
         selected: "bg-purple-100 text-purple-700",
         hover: "hover:bg-purple-50",
      },
      blue: {
         gradient: "from-white to-blue-50",
         border: "border-blue-200 hover:border-blue-300 focus:border-blue-400",
         ring: "focus:ring-blue-100",
         icon: "text-blue-500",
         menu: "border-blue-200",
         selected: "bg-blue-100 text-blue-700",
         hover: "hover:bg-blue-50",
      },
      green: {
         gradient: "from-white to-green-50",
         border: "border-green-200 hover:border-green-300 focus:border-green-400",
         ring: "focus:ring-green-100",
         icon: "text-green-500",
         menu: "border-green-200",
         selected: "bg-green-100 text-green-700",
         hover: "hover:bg-green-50",
      },
   };

   const colors = colorClasses[color];

   return (
      <div className="relative" ref={dropdownRef}>
         <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl bg-gradient-to-br ${colors.gradient} border-2 ${colors.border} ${colors.ring} hover:shadow-lg focus:outline-none focus:ring-4 text-sm font-medium text-gray-700 transition-all duration-200 min-w-[150px]`}>
            <span className="flex-1 text-left">
               {selectedOption?.icon && <span className="mr-2">{selectedOption.icon}</span>}
               {displayText}
            </span>
            <ChevronDownIcon
               className={`w-4 h-4 ${colors.icon} transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
         </button>
         {isOpen && (
            <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 ${colors.menu} shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200`}>
               {options.map((option) => (
                  <button
                     key={option.value}
                     type="button"
                     onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                     }}
                     className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        value === option.value
                           ? `${colors.selected} font-semibold`
                           : `text-gray-700 ${colors.hover}`
                     }`}>
                     {option.icon && <span className="mr-2">{option.icon}</span>}
                     {option.label}
                  </button>
               ))}
            </div>
         )}
      </div>
   );
}