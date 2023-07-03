import {useDateFormat } from '@vueuse/core'
export const useFormat = () => {
    const formatDate = (date) => {
        const timestamp = Date.parse(date);
        return isNaN(timestamp) ? 'N/A' : useDateFormat(date, 'MMM D, YYYY').value
    }

    return {formatDate}
}