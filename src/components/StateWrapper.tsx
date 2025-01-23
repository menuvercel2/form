import React from 'react';

interface StateWrapperProps {
    isLoading: boolean;
    error: string | null;
    children: React.ReactNode;
}

export default function StateWrapper({
    isLoading,
    error,
    children,
}: StateWrapperProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                {error}
            </div>
        );
    }

    return <>{children}</>;
}