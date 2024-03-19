import type { QueryError } from "@supabase/supabase-js";
export class FetchError extends Error {
    message: string;
    name: string;
    code: string;
    queryName: string;
    constructor(error: QueryError, queryName: string = 'Unknown query') {
        super()
        const {message, code} = error;
        this.message = `${message} (${queryName})`;
        this.name = 'FetchError'
        this.code = code;
        this.queryName = queryName;

    }
}