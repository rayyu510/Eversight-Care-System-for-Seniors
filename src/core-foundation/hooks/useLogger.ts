export const useLogger = () => {
    return {
        log: (): void => { },
        error: (): void => { },
        warn: (): void => { },
        info: (): void => { }
    };
};

export default useLogger;
