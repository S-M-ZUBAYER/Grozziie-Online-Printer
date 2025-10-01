import { useState, useMemo, useCallback, useEffect } from "react";

export const usePagination = (initialData, itemsPerPage = 5) => {
    const [data, setData] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ Sync with initialData changes
    useEffect(() => {
        setData(initialData);
        setCurrentPage(1); // Reset to first page when data changes
    }, [initialData]);

    const totalPages = useMemo(() =>
        Math.ceil((data?.length || 0) / itemsPerPage),
        [data, itemsPerPage]
    );

    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data?.slice(startIndex, startIndex + itemsPerPage) || [];
    }, [data, currentPage, itemsPerPage]);

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const goToPage = useCallback((page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);

    const goToNext = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
    const goToPrevious = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

    // Add method to update data
    const updateData = useCallback((newData) => {
        setData(newData);
        setCurrentPage(1); // Reset to first page when data changes
    }, []);

    return {
        currentPage,
        currentData,
        totalPages,
        canGoPrevious,
        canGoNext,
        goToPage,
        goToNext,
        goToPrevious,
        updateData,
        originalData: data,
    };
};