import { SupabaseClient } from "@supabase/supabase-js";
import {QueryCache as CacheType} from '@/service/cache'
import cache from '@/service/cache'
import { supabaseClient } from "@/service/client/createClient";
import throttle from 'lodash.throttle'
import { timeout } from "@/business/utils/async/timeout";
export class Client {
    client: SupabaseClient;
    cache: CacheType;
    id: string;
    queue: Map<string, Function>
    constructor() {
        this.client = supabaseClient();
        this.cache = cache;
        this.id = (Math.random() * 1000000000000).toFixed();
        this.queue = new Map();
    }

    private changeEvent = (func: Function) => {
        func();
    }

    private listenForChange = (key: string, func: Function) => {
        this.cache.onChange(key, () => this.changeEvent(func), this.id)
    }

    private setQueueFunc = throttle((queryKey: string, func: Function) => {
        this.queue.set(queryKey, func)
    }, 1)

    public fetch = async ({
        queryKey,
        queryFunc,
        onChange
  
        
    }: {
        queryKey: string;
        queryFunc: Function;
        onChange: Function;
    
        
    }) => {
        this.setQueueFunc(queryKey, queryFunc)
        await timeout(2)
        const func = this.queue.get(queryKey);
        const val = await func();
      
        this.listenForChange(queryKey, async () => await this.fetch({
            queryKey,
            queryFunc,  
            onChange
        }))
        return val
       
    }


}