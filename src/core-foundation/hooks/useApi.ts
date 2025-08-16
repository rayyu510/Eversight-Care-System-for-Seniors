export const useApi = () => {
    return {
        loading: false,
        error: null,
        request: async (): Promise<any> => ({ success: false }),
        get: async (): Promise<any> => ({ success: false }),
        post: async (): Promise<any> => ({ success: false }),
        put: async (): Promise<any> => ({ success: false }),
        delete: async (): Promise<any> => ({ success: false })
    };
};

export default useApi;