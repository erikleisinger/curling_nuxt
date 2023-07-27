import {TABLE_QUERIES} from "@/constants/query";

export const useDatabase = () => {
  const getQuery = (tableName) => {
    return TABLE_QUERIES[tableName] ?? "*";
  };

  const getUser = () => {
    const user = useSupabaseUser();
    return user?.value;
  };
  const getUserId = () => {
    return getUser()?.id;
  }


  const enumToSelectionOptions = (e) => {
    return Object.entries(e).reduce((all, [key, value]) => {
      if (isNaN(Number(value))) return all;
      return [
        ...all,
        {
          label: key,
          value,
        },
      ];
    }, []);
  };
  return {enumToSelectionOptions, getQuery, getUser, getUserId};
};
