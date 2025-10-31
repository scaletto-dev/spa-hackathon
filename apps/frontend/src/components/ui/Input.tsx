import React, { forwardRef, useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    error?: string | undefined;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    onRightIconClick?: () => void;
    mask?: 'phone' | 'number';
    'data-testid'?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className = '',
            error,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            onRightIconClick,
            disabled,
            mask,
            type = 'text',
            onBlur,
            onChange,
            value,
            'data-testid': dataTestId,
            ...props
        },
        ref
    ) => {
        const [displayValue, setDisplayValue] = useState(value?.toString() || '');

        useEffect(() => {
            setDisplayValue(value?.toString() || '');
        }, [value]);

        const formatPhone = (val: string): string => {
            // Remove all non-digits
            const cleaned = val.replace(/\D/g, '');

            // Format as (+84) 912 345 678
            if (cleaned.startsWith('84')) {
                const withoutPrefix = cleaned.slice(2);
                if (withoutPrefix.length <= 3) return `(+84) ${withoutPrefix}`;
                if (withoutPrefix.length <= 6)
                    return `(+84) ${withoutPrefix.slice(0, 3)} ${withoutPrefix.slice(3)}`;
                return `(+84) ${withoutPrefix.slice(0, 3)} ${withoutPrefix.slice(3, 6)} ${withoutPrefix.slice(6, 9)}`;
            }

            // Format as 0912 345 678
            if (cleaned.length <= 4) return cleaned;
            if (cleaned.length <= 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
            return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)}`;
        };

        const formatNumber = (val: string): string => {
            const num = parseFloat(val.replace(/,/g, ''));
            if (isNaN(num)) return val;
            return num.toLocaleString('vi-VN');
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            if (mask === 'phone' && displayValue) {
                const formatted = formatPhone(displayValue);
                setDisplayValue(formatted);
            } else if (mask === 'number' && displayValue) {
                const formatted = formatNumber(displayValue);
                setDisplayValue(formatted);
            }
            onBlur?.(e);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setDisplayValue(newValue);

            // For phone, pass clean value
            if (mask === 'phone') {
                const cleaned = newValue.replace(/\D/g, '');
                e.target.value = cleaned;
            }
            // For number, pass numeric value
            else if (mask === 'number') {
                const cleaned = newValue.replace(/,/g, '');
                e.target.value = cleaned;
            }

            onChange?.(e);
        };

        const baseClasses = `
      w-full h-11 md:h-12 px-3.5 
      bg-white
      text-gray-900 placeholder:text-gray-400
      border border-gray-300/80 rounded-xl
      transition-all duration-200
      outline-none
      hover:border-gray-400
      focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30
      disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
      ${LeftIcon ? 'pl-10' : ''}
      ${RightIcon ? 'pr-10' : ''}
      ${className}
    `;

        return (
            <div className="relative">
                {LeftIcon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <LeftIcon className="w-5 h-5 text-gray-400" />
                    </div>
                )}

                <input
                    ref={ref}
                    type={type}
                    className={baseClasses}
                    disabled={disabled}
                    value={displayValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${props.name}-error` : props['aria-describedby']}
                    data-testid={dataTestId || props.name}
                    {...props}
                />

                {RightIcon && (
                    <div
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${
                            onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'
                        }`}
                        onClick={onRightIconClick}
                    >
                        <RightIcon
                            className={`w-5 h-5 ${
                                onRightIconClick
                                    ? 'text-gray-600 hover:text-gray-800'
                                    : 'text-gray-400'
                            }`}
                        />
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
