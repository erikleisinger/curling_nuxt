export const useSort = () => {
    const sortAlphabetically = (a,b, asc = true) => {
        if (a < b) {
            return asc ? -1 : 1;
          }
          if (a > b) {
            return asc ? 1: -1;
          }
          return 0;
    }
    const sortNameAlphabetically = (a,b) => {
        const aName = a?.name?.toLowerCase();
        const bName = b?.name?.toLowerCase();
        return sortAlphabetically(aName, bName)
    }
    return {sortAlphabetically, sortNameAlphabetically}
}