export const useFormat = () => {
    const formatDate = (date, format = 'MMM D, YYYY', fallback = 'N/A') => {
      return date;
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