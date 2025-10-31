import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
interface BookingProgressProps {
    currentStep: number;
    steps: string[];
}
export function BookingProgress({ currentStep, steps }: BookingProgressProps) {
    return (
        <div className="w-full">
            <div className="hidden md:flex justify-between items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;
                    return (
                        <div key={step} className="flex flex-col items-center flex-1">
                            <div className="relative flex items-center justify-center w-full">
                                <motion.div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                            : isCompleted
                                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                                              : 'bg-white border-2 border-gray-200 text-gray-400'
                                    }`}
                                    animate={
                                        isActive
                                            ? {
                                                  scale: [1, 1.1, 1],
                                              }
                                            : {
                                                  scale: 1,
                                              }
                                    }
                                    transition={{
                                        duration: 0.5,
                                        repeat: isActive ? Infinity : 0,
                                        repeatDelay: 2,
                                    }}
                                >
                                    {isCompleted ? (
                                        <CheckIcon className="w-6 h-6" />
                                    ) : (
                                        <span className="text-lg font-semibold">{stepNumber}</span>
                                    )}
                                </motion.div>
                                {index < steps.length - 1 && (
                                    <div className="absolute left-[calc(50%+24px)] right-[-50%] h-1 bg-gray-200">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                                            initial={{
                                                width: '0%',
                                            }}
                                            animate={{
                                                width: isCompleted ? '100%' : '0%',
                                            }}
                                            transition={{
                                                duration: 0.5,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <span
                                className={`mt-2 text-sm font-medium text-center ${
                                    isActive
                                        ? 'text-pink-600'
                                        : isCompleted
                                          ? 'text-gray-700'
                                          : 'text-gray-400'
                                }`}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
            {/* Mobile view */}
            <div className="flex md:hidden items-center justify-center">
                <span className="text-lg font-medium text-gray-700">
                    {currentStep} / {steps.length}:{' '}
                    <span className="text-pink-600">{steps[currentStep - 1]}</span>
                </span>
            </div>
        </div>
    );
}
