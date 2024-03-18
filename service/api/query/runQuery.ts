import { FetchError } from "@/service/types/error";
export default async (query: Function) => {
        const {data, error} = await query();
        if (error) {
            throw new FetchError(error)
        }
        return data;
    
}