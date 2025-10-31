import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircleIcon, CheckCircleIcon, InfoIcon } from 'lucide-react';

export interface FormFieldProps {
    label?: string;
    name: string;
    error?: string | undefined;
    helpText?: string;
    success?: string;
    info?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
    'data-testid'?: string;
}

export function FormField({
    label,
    name,
    error,
    helpText,
    success,
    info,
    required,
    children,
    className = '',
    'data-testid': dataTestId,
}: FormFieldProps) {
    const helpId = `${name}-help`;
    const errorId = `${name}-error`;

    return (
        <div className={`mb-5 md:mb-6 ${className}`} data-testid={dataTestId}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-pink-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">{children}</div>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        id={errorId}
                        className="flex items-start gap-1.5 mt-1.5 text-sm text-red-600"
                        role="alert"
                        aria-live="polite"
                    >
                        <AlertCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </motion.div>
                )}

                {!error && success && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-start gap-1.5 mt-1.5 text-sm text-emerald-600"
                        role="status"
                        aria-live="polite"
                    >
                        <CheckCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{success}</span>
                    </motion.div>
                )}

                {!error && !success && info && (
                    <motion.div
                        key="info"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-start gap-1.5 mt-1.5 text-sm text-blue-600"
                        role="status"
                    >
                        <InfoIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{info}</span>
                    </motion.div>
                )}

                {!error && !success && !info && helpText && (
                    <motion.div
                        key="help"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        id={helpId}
                        className="mt-1.5 text-sm text-gray-500"
                    >
                        {helpText}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
