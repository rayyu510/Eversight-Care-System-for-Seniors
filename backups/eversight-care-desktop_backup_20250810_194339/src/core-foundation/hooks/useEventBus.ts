export const useEventBus = () => {
    return {
        emit: (): void => { },
        subscribe: (): string => '',
        unsubscribe: (): void => { }
    };
};

export default useEventBus;
