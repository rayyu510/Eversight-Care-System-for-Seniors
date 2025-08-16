import { useState } from 'react';

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
    const [value] = useState<T>(defaultValue);

    return {
        value,
        setValue: (): void => { },
        removeValue: (): void => { },
        isLoading: false
    };
};

export default useLocalStorage;
