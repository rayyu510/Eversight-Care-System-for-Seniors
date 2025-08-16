export const useNotifications = () => {
    return {
        notify: (): void => { },
        error: (): void => { },
        success: (): void => { }
    };
};

export default useNotifications;
