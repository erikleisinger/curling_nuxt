export const VALIDATION_RULES = {
    REQUIRED: (val) => !!val || 'Field is required',
    MAX_LENGTH: (length) => {
        return (val) => val?.length <= length || `Maximum length ${length} characters.`
    },
    MIN_LENGTH: (length) => {
        return (val) => val?.length >= length || `Minimum length ${length} characters.`
    },
    NO_SPECIAL: (val) => {
        const chars = new RegExp(/[ `!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?~]/);
        return !chars.test(val) || 'Must contain only letters, underscores, and periods.'
    },
    ALPHA_ONLY: (val) =>{
        const reg = new RegExp(/^[A-Za-z ]+$/)
        return reg.test(val) || 'Must contain only alphanumeric characters.'
    }
  
};

export const MAX_TEAM_NAME_LENGTH = '25'