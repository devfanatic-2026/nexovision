import React from 'react';
import { Paginator } from '@nexovision/ui-kit';
import { createFloatStore } from "@float.js/lite";

export interface PaginationState {
    currentPage: number;
}

export const usePaginationStore = createFloatStore<PaginationState>({
    currentPage: 1
});

export interface PaginatorContainerProps {
    totalPages: number;
    onPageChange?: (page: number) => void;
}

export const PaginatorContainer: React.FC<PaginatorContainerProps> = ({
    totalPages,
    onPageChange
}) => {
    const { currentPage } = usePaginationStore();

    const handlePageChange = (page: number) => {
        usePaginationStore.setState({ currentPage: page });
        if (onPageChange) {
            onPageChange(page);
        }
    };

    return (
        <Paginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    );
};
