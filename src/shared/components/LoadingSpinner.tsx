// src/shared/components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    message = 'Loading...'
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
            {message && (
                <p className="text-gray-600 mt-4 text-sm">{message}</p>
            )}
        </div>
    );
};

// src/shared/components/ErrorMessage.tsx
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <div className="flex-1">
                    <p className="text-red-800 font-medium">Error</p>
                    <p className="text-red-600 text-sm mt-1">{message}</p>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
};