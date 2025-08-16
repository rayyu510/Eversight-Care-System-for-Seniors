import { useState } from 'react';

export const useSessionStorage = <T>(key: string, defaultValue: T) => {
    const [value] = useState<T>(defaultValue);

    return {
        value,
        setValue: (): void => { },
        removeValue: (): void => { },
        isLoading: false
    };
};

export default useSessionStorage;
