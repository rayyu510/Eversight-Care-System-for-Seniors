export const useValidation = () => {
    return {
        validate: (): any => ({ isValid: true, errors: [] })
    };
};

export default useValidation;
