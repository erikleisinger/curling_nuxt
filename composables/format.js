import {useDateFormat } from '@vueuse/core'
export const useFormat = () => {
    const formatDate = (date, format = 'MMM D, YYYY', fallback = 'N/A') => {
        const timestamp = Date.parse(date);
        return isNaN(timestamp) ? fallback : useDateFormat(date, format).value
    }

    const formatPlayerForSelection = (player) => {
        const {id, name} = player;
        return {
          value: id,
          label: name,
        };
      }

    const formatShotTypeForSelection = (st) => {
      const {id, name} = st;
      return {
        value: id,
        label: name,
      };
    }

    return {formatDate, formatPlayerForSelection, formatShotTypeForSelection}
}