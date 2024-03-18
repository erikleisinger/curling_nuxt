import type { QueryError } from "@supabase/supabase-js";
export class FetchError extends Error {
    message: string;
    name: string;
    code: string;
    constructor(error: QueryError) {
        super()
        const {message, code} = error;
        this.message = message;
        this.name = 'FetchError'
        this.code = code;

    }
}