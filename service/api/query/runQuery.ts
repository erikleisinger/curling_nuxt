import { FetchError } from "@/service/types/error";
export default async (query: Function, queryName: string) => {
        const {data, error} = await query();
        if (error) {
            throw new FetchError(error, queryName)
        }
        return data;
    
}