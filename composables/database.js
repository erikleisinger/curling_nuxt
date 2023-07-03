import { TABLE_SCHEMA } from "@/constants/tables"
import { TABLE_QUERIES } from "@/constants/query"

export const useDatabase = () => {
     const  getSchema = (tableName) => {
        return TABLE_SCHEMA[tableName]
     };
     const getQuery = (tableName) => {
      return TABLE_QUERIES[tableName] ?? '*'
     };
    return { getSchema, getQuery }
}