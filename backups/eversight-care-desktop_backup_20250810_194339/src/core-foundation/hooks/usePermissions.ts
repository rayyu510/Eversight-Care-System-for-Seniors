export const usePermissions = () => {
    return {
        hasPermission: (): boolean => true,
        hasRole: (): boolean => true,
        permissions: []
    };
};

export default usePermissions;