export const VALIDATION_RULES = {
    REQUIRED: (val) => !!val || 'Field is required',
    MIN_LENGTH: (length) => {
        return (val) => val?.length >= length || `Minimum length ${length} characters.`
    }
};