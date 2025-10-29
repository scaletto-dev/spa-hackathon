import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, SearchIcon, XIcon, LoaderIcon } from 'lucide-react';
import { SelectOption, SelectGroup } from './Select';

export interface MultiSelectProps {
    name: string;
    value?: string[];
    onChange: (value: string[]) => void;
    options?: SelectOption[];
    groups?: SelectGroup[];
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    searchable?: boolean;
    loading?: boolean;
    emptyText?: string;
    maxSelections?: number;
    className?: string;
    'data-testid'?: string;
}

export function MultiSelect({
    name,
    value = [],
    onChange,
    options = [],
    groups = [],
    placeholder = 'Chọn nhiều...',
    error,
    disabled,
    searchable = true,
    loading = false,
    emptyText = 'Không tìm thấy kết quả',
    maxSelections,
    className = '',
    'data-testid': dataTestId,
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const allOptions = groups.length > 0 ? groups.flatMap((g) => g.options) : options;

    const selectedOptions = allOptions.filter((opt) => value.includes(opt.value));

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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                    handleToggle(filteredOptions[highlightedIndex].value);
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
        }
    };

    const handleToggle = (optionValue: string) => {
        if (value.includes(optionValue)) {
            onChange(value.filter((v) => v !== optionValue));
        } else {
            if (maxSelections && value.length >= maxSelections) {
                return;
            }
            onChange([...value, optionValue]);
        }
    };

    const handleRemove = (optionValue: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(value.filter((v) => v !== optionValue));
    };

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange([]);
    };

    const baseClasses = `
    w-full min-h-[44px] md:min-h-[48px] px-3.5 py-2
    bg-white
    text-gray-900
    border border-gray-300/80 rounded-xl
    transition-all duration-200
    outline-none
    cursor-pointer
    hover:border-gray-400
    focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/30
    disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50
    ${error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-200' : ''}
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
                <div className='flex flex-wrap gap-1.5 items-center pr-8'>
                    {selectedOptions.length === 0 ? (
                        <span className='text-gray-400'>{placeholder}</span>
                    ) : (
                        selectedOptions.map((option) => (
                            <motion.span
                                key={option.value}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className='inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-lg text-sm font-medium'
                            >
                                {option.label}
                                <button
                                    type='button'
                                    onClick={(e) => handleRemove(option.value, e)}
                                    className='hover:bg-pink-200 rounded p-0.5 transition-colors'
                                >
                                    <XIcon className='w-3 h-3' />
                                </button>
                            </motion.span>
                        ))
                    )}
                </div>

                <div className='absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1'>
                    {selectedOptions.length > 0 && (
                        <button
                            type='button'
                            onClick={handleClearAll}
                            className='p-1 hover:bg-gray-100 rounded transition-colors'
                            title='Xoá tất cả'
                        >
                            <XIcon className='w-4 h-4 text-gray-500' />
                        </button>
                    )}
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
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className='absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden'
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
                            aria-multiselectable='true'
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
                                        {group.options.map((option) => {
                                            const isSelected = value.includes(option.value);
                                            const isDisabled =
                                                option.disabled ||
                                                (maxSelections ? !isSelected && value.length >= maxSelections : false);

                                            return (
                                                <div
                                                    key={option.value}
                                                    role='option'
                                                    aria-selected={isSelected}
                                                    onClick={() => !isDisabled && handleToggle(option.value)}
                                                    onMouseEnter={() => setHighlightedIndex(allOptions.indexOf(option))}
                                                    className={`
                            px-4 py-2.5 cursor-pointer transition-colors flex items-center gap-2
                            ${isSelected ? 'bg-pink-50 text-pink-700 font-medium' : 'text-gray-900'}
                            ${highlightedIndex === allOptions.indexOf(option) ? 'bg-gray-50' : ''}
                            ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                          `}
                                                >
                                                    <input
                                                        type='checkbox'
                                                        checked={isSelected}
                                                        readOnly
                                                        className='w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500'
                                                    />
                                                    {option.label}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))
                            ) : (
                                filteredOptions.map((option, idx) => {
                                    const isSelected = value.includes(option.value);
                                    const isDisabled =
                                        option.disabled ||
                                        (maxSelections ? !isSelected && value.length >= maxSelections : false);

                                    return (
                                        <div
                                            key={option.value}
                                            role='option'
                                            aria-selected={isSelected}
                                            onClick={() => !isDisabled && handleToggle(option.value)}
                                            onMouseEnter={() => setHighlightedIndex(idx)}
                                            className={`
                        px-4 py-2.5 cursor-pointer transition-colors flex items-center gap-2
                        ${isSelected ? 'bg-pink-50 text-pink-700 font-medium' : 'text-gray-900'}
                        ${highlightedIndex === idx ? 'bg-gray-50' : ''}
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
                      `}
                                        >
                                            <input
                                                type='checkbox'
                                                checked={isSelected}
                                                readOnly
                                                className='w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500'
                                            />
                                            {option.label}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
