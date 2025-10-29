import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, SearchIcon, LoaderIcon } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectGroup {
    label: string;
    options: SelectOption[];
}

export interface SelectProps {
    name: string;
    value?: string;
    onChange: (value: string) => void;
    options?: SelectOption[];
    groups?: SelectGroup[];
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    searchable?: boolean;
    loading?: boolean;
    emptyText?: string;
    className?: string;
    'data-testid'?: string;
}

export function Select({
    name,
    value,
    onChange,
    options = [],
    groups = [],
    placeholder = 'Chọn...',
    error,
    disabled,
    searchable = true,
    loading = false,
    emptyText = 'Không tìm thấy kết quả',
    className = '',
    'data-testid': dataTestId,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Flatten options from groups if provided
    const allOptions = groups.length > 0 ? groups.flatMap((g) => g.options) : options;

    const selectedOption = allOptions.find((opt) => opt.value === value);

    // Filter options based on search
    const filteredOptions = searchQuery
        ? allOptions.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : allOptions;

    const filteredGroups =
        groups.length > 0
            ? groups
                  .map((g) => ({
                      ...g,
                      options: g.options.filter((opt) =>
                          searchQuery ? opt.label.toLowerCase().includes(searchQuery.toLowerCase()) : true,
                      ),
                  }))
                  .filter((g) => g.options.length > 0)
            : [];

    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calculate dropdown position to avoid overflow
    useEffect(() => {
        if (isOpen && containerRef.current && dropdownRef.current) {
            const container = containerRef.current.getBoundingClientRect();
            const dropdownHeight = 320; // max height
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - container.bottom;
            const spaceAbove = container.top;

            // If not enough space below and more space above, flip to top
            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                setDropdownPosition('top');
            } else {
                setDropdownPosition('bottom');
            }
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                    handleSelect(filteredOptions[highlightedIndex].value);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setSearchQuery('');
                setHighlightedIndex(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (isOpen) {
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
                }
                break;
            case 'Tab':
                if (isOpen) {
                    setIsOpen(false);
                    setSearchQuery('');
                }
                break;
        }
    };

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
    };

    const baseClasses = `
    w-full h-11 md:h-12 px-3.5 pr-10
    bg-white
    text-gray-900
    border border-gray-300/80 rounded-xl
    transition-all duration-200
    outline-none
    cursor-pointer
    hover:border-gray-400
    focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30
    disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
    ${isOpen ? 'border-pink-500 ring-2 ring-pink-500/30' : ''}
    ${className}
  `;

    return (
        <div ref={containerRef} className='relative'>
            <div
                role='combobox'
                aria-expanded={isOpen}
                aria-haspopup='listbox'
                aria-controls={`${name}-listbox`}
                aria-invalid={error ? 'true' : 'false'}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={handleKeyDown}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={baseClasses}
                data-testid={dataTestId || name}
            >
                <div className='flex items-center h-full'>
                    <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
                        {selectedOption?.label || placeholder}
                    </span>
                </div>

                <div className='absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none'>
                    {loading ? (
                        <LoaderIcon className='w-5 h-5 text-gray-400 animate-spin' />
                    ) : (
                        <ChevronDownIcon
                            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && !loading && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: dropdownPosition === 'top' ? 10 : -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: dropdownPosition === 'top' ? 10 : -10 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden ${
                            dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                        }`}
                        style={{ maxHeight: '320px' }}
                    >
                        {searchable && (
                            <div className='p-2 border-b border-gray-100 sticky top-0 bg-white'>
                                <div className='relative'>
                                    <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                                    <input
                                        ref={searchInputRef}
                                        type='text'
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder='Tìm kiếm...'
                                        className='w-full h-9 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-pink-300 focus:bg-white'
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )}

                        <div
                            id={`${name}-listbox`}
                            role='listbox'
                            className='overflow-y-auto'
                            style={{ maxHeight: searchable ? '272px' : '320px' }}
                        >
                            {filteredOptions.length === 0 ? (
                                <div className='px-4 py-8 text-center text-sm text-gray-500'>{emptyText}</div>
                            ) : groups.length > 0 ? (
                                filteredGroups.map((group) => (
                                    <div key={group.label}>
                                        <div className='px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0'>
                                            {group.label}
                                        </div>
                                        {group.options.map((option) => (
                                            <div
                                                key={option.value}
                                                role='option'
                                                aria-selected={value === option.value}
                                                onClick={() => !option.disabled && handleSelect(option.value)}
                                                onMouseEnter={() => setHighlightedIndex(allOptions.indexOf(option))}
                                                className={`
                          px-4 py-2.5 cursor-pointer transition-colors
                          ${value === option.value ? 'bg-pink-50 text-pink-700 font-medium' : 'text-gray-900'}
                          ${highlightedIndex === allOptions.indexOf(option) ? 'bg-gray-50' : ''}
                          ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                        `}
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : (
                                filteredOptions.map((option, idx) => (
                                    <div
                                        key={option.value}
                                        role='option'
                                        aria-selected={value === option.value}
                                        onClick={() => !option.disabled && handleSelect(option.value)}
                                        onMouseEnter={() => setHighlightedIndex(idx)}
                                        className={`
                      px-4 py-2.5 cursor-pointer transition-colors
                      ${value === option.value ? 'bg-pink-50 text-pink-700 font-medium' : 'text-gray-900'}
                      ${highlightedIndex === idx ? 'bg-gray-50' : ''}
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                    `}
                                    >
                                        {option.label}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
