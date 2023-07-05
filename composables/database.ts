import {TABLE_SCHEMA} from "@/constants/tables";
import {TABLE_QUERIES} from "@/constants/query";

export const useDatabase = () => {
  const getSchema = (tableName: string) => {
    return TABLE_SCHEMA[tableName];
  };
  const getQuery = (tableName: string) => {
    return TABLE_QUERIES[tableName] ?? "*";
  };

  const getUser = () => {
    const user = useSupabaseUser();
    return user?.value;
  };

  const getClient = () => {
    const client = useSupabaseAuthClient();
    return client;
  };

  const enumToSelectionOptions = (e: any) => {
    return Object.entries(e).reduce((all: any, [key, value]) => {
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
  return {enumToSelectionOptions, getClient, getSchema, getQuery, getUser};
};
