import {Query} from '@/service/types/Query'
export class QueryHandler {
    queries: Map<string, Query>;
    running: boolean;
    constructor() {
        this.queries = new Map();
        this.running = false;
    }

    public addQuery(key: string, func: Function) {
        const cachedQuery = this.queries.get(key);
        if (cachedQuery) return;
        this.queries.set(key, new Query(key, func))
    }

    private queueQuery(key: string, func: Function) {
        if (this.running) return;
    }

    public addQuerySequentially(key: string, func: Function) {
        if (this.running) 
    }
}