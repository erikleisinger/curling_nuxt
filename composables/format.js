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

    const formatNumberWithSuffix = (i) => {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return {capitalizeFirstLetter,formatDate, formatPlayerForSelection, formatShotTypeForSelection, formatNumberWithSuffix}
}