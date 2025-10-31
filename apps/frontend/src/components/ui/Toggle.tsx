import { motion } from 'framer-motion';

export interface ToggleProps {
    name: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
    'data-testid'?: string;
}

export function Toggle({
    name,
    checked,
    onChange,
    label,
    disabled,
    className = '',
    'data-testid': dataTestId,
}: ToggleProps) {
    const handleToggle = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    return (
        <label
            className={`
        inline-flex items-center gap-3 cursor-pointer group
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
        >
            <div
                onClick={handleToggle}
                className={`
          relative w-11 h-6 rounded-full transition-colors duration-200
          ${checked ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-300'}
          ${disabled ? '' : 'cursor-pointer'}
        `}
                data-testid={dataTestId || name}
            >
                <motion.div
                    initial={false}
                    animate={{
                        x: checked ? 22 : 2,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                    }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
            </div>

            {label && (
                <span
                    className={`
            text-sm font-medium select-none
            ${disabled ? 'text-gray-400' : 'text-gray-700 group-hover:text-gray-900'}
          `}
                >
                    {label}
                </span>
            )}

            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="sr-only"
            />
        </label>
    );
}
