import { useState, useEffect } from 'react';

// Custom hook for debounced input
export const useDebouncedSearch = (inputValue, delay = 1000) => {

    const [debouncedValue, setDebouncedValue] = useState(inputValue);

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, delay); // Delay in milliseconds

        // Cleanup on input change or component unmount
        return () => clearTimeout(debounceTimeout);
    }, [inputValue, delay]);

    return debouncedValue;
};
