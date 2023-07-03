import { TABLE_SCHEMA } from "@/constants/tables"
import { TABLE_QUERIES } from "@/constants/query"

export const useDatabase = () => {
     const  getSchema = (tableName) => {
        return TABLE_SCHEMA[tableName]
     };
     const getQuery = (tableName) => {
      return TABLE_QUERIES[tableName] ?? '*'
     };

     const getUser = () => {
      const user = useSupabaseUser();
      return user?.value;
     }

     const getClient = () => {
      const client = useSupabaseAuthClient();
      return client;
     }
    return { getClient, getSchema, getQuery, getUser }
}