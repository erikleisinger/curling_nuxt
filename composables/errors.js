import {ERROR_CODES, ERROR_MESSAGES} from '@/constants/errors'

export const useErrors = () => {
    const getErrorMessage = (e) => {
        const {message, code} = e || {};
        if (!message || !code) return null;
        if (!ERROR_CODES[code]) return null;
        let error = null;
        ERROR_CODES[code].forEach((regexp) => {
            const reg = new RegExp(regexp);
            const isError = reg.test(message)
            if (isError) error = ERROR_MESSAGES[regexp]
        })
        return error;
    }

    return { getErrorMessage }
}