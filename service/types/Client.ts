import { SupabaseClient } from "@supabase/supabase-js";
import {QueryCache as CacheType} from '@/service/cache'
import cache from '@/service/cache'
import { supabaseClient } from "@/service/client/createClient";
import throttle from 'lodash.throttle'
import { timeout } from "@/business/utils/async/timeout";
import type {Query} from '@/service/types/Query'


export class Client {
    client: SupabaseClient;
    cache: CacheType;
    id: string;
    queue: Map<string, Function | null>
    constructor() {
        this.client = supabaseClient();
        this.cache = cache;
        this.id = (Math.random() * 1000000000000).toFixed();
        this.queue = new Map();
    }

    private changeEvent = (func: Function) => {
        func();
    }

    private listenForChange = (key: string, func: Function, callbackId: string) => {
        this.cache.onChange(key, () => this.changeEvent(func), callbackId)
    }

    private setQueueFunc = throttle( (queryKey: string, func: Function) => {
        if (this.cache.has(queryKey)) return;
        this.cache.set(queryKey, null)
        func().then((data) => {
            this.cache.set(queryKey, data)
        })
    }, 1)


    private getCacheValue = async (queryKey: string, func: Function) => {
        const val = this.cache.get(queryKey);
        if (!val) {
            this.setQueueFunc(queryKey, func)
            await timeout(100);
            return this.getCacheValue(queryKey, func)
        }
        return val;
           
    }

    public fetch = async ({
        queryKey,
        queryFunc,
        onChange,
        callbackId = (Math.random() * 1000000000000).toFixed()
        
    }: {
        queryKey: string;
        queryFunc: Function;
        onChange: Function;
        callbackId: string;
    
        
    }) => {
        this.listenForChange(queryKey, async () => await this.fetch({
            queryKey,
            queryFunc,  
            onChange,
            callbackId
        }).then((res) => {
            if (!onChange) return res;
            onChange(res)
        }), callbackId);

        const val = await this.getCacheValue(queryKey, queryFunc);
        return val;
    }


}