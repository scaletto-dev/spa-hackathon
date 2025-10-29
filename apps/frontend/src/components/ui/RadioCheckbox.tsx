import { forwardRef } from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
    error?: string;
    'data-testid'?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
    ({ label, error, disabled, className = '', 'data-testid': dataTestId, ...props }, ref) => {
        return (
            <label
                className={`
          inline-flex items-center gap-3 cursor-pointer group
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          ${className}
        `}
            >
                <input
                    ref={ref}
                    type='radio'
                    disabled={disabled}
                    className={`
            w-4 h-4 
            text-pink-600 
            border-gray-300 
            focus:ring-2 focus:ring-pink-500/30 focus:ring-offset-0
            disabled:cursor-not-allowed
            cursor-pointer
            ${error ? 'border-red-500' : ''}
          `}
                    data-testid={dataTestId || props.name}
                    {...props}
                />
                <span
                    className={`
            text-sm font-medium select-none
            ${disabled ? 'text-gray-400' : 'text-gray-700 group-hover:text-gray-900'}
          `}
                >
                    {label}
                </span>
            </label>
        );
    },
);

Radio.displayName = 'Radio';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
    error?: string;
    'data-testid'?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, disabled, className = '', 'data-testid': dataTestId, ...props }, ref) => {
        return (
            <label
                className={`
          inline-flex items-center gap-3 cursor-pointer group
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          ${className}
        `}
            >
                <input
                    ref={ref}
                    type='checkbox'
                    disabled={disabled}
                    className={`
            w-4 h-4 
            text-pink-600 
            border-gray-300 
            rounded
            focus:ring-2 focus:ring-pink-500/30 focus:ring-offset-0
            disabled:cursor-not-allowed
            cursor-pointer
            ${error ? 'border-red-500' : ''}
          `}
                    data-testid={dataTestId || props.name}
                    {...props}
                />
                <span
                    className={`
            text-sm font-medium select-none
            ${disabled ? 'text-gray-400' : 'text-gray-700 group-hover:text-gray-900'}
          `}
                >
                    {label}
                </span>
            </label>
        );
    },
);

Checkbox.displayName = 'Checkbox';
