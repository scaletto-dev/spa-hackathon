import React, { forwardRef, useEffect, useRef, useState } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    showCounter?: boolean;
    autoResize?: boolean;
    'data-testid'?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className = '',
            error,
            showCounter = false,
            autoResize = true,
            maxLength,
            value,
            onChange,
            disabled,
            'data-testid': dataTestId,
            ...props
        },
        ref,
    ) => {
        const [charCount, setCharCount] = useState(0);
        const textareaRef = useRef<HTMLTextAreaElement | null>(null);

        useEffect(() => {
            if (value) {
                setCharCount(value.toString().length);
            }
        }, [value]);

        useEffect(() => {
            if (autoResize && textareaRef.current) {
                adjustHeight();
            }
        }, [value, autoResize]);

        const adjustHeight = () => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, window.innerHeight * 0.4);
            textarea.style.height = `${newHeight}px`;
        };

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = e.target.value;
            setCharCount(newValue.length);

            if (autoResize) {
                adjustHeight();
            }

            onChange?.(e);
        };

        const setRefs = (node: HTMLTextAreaElement) => {
            textareaRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        };

        const baseClasses = `
      w-full px-3.5 py-3
      bg-white
      text-gray-900 placeholder:text-gray-400
      border border-gray-300/80 rounded-xl
      transition-all duration-200
      outline-none
      resize-none
      hover:border-gray-400
      focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30
      disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
      ${autoResize ? '' : 'min-h-[120px]'}
      ${className}
    `;

        return (
            <div className='relative'>
                <textarea
                    ref={setRefs}
                    className={baseClasses}
                    disabled={disabled}
                    value={value}
                    onChange={handleChange}
                    maxLength={maxLength}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${props.name}-error` : props['aria-describedby']}
                    data-testid={dataTestId || props.name}
                    style={autoResize ? { minHeight: '120px', maxHeight: '40vh' } : undefined}
                    {...props}
                />

                {showCounter && maxLength && (
                    <div className='absolute bottom-2 right-3 text-xs text-gray-500 pointer-events-none'>
                        {charCount}/{maxLength}
                    </div>
                )}
            </div>
        );
    },
);

Textarea.displayName = 'Textarea';
