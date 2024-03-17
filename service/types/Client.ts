import { SupabaseClient } from "@supabase/supabase-js";
import {QueryCache as CacheType} from '@/service/cache'
import cache from '@/service/cache'
import { supabaseClient } from "@/service/client/createClient";
import {FunctionQueue} from '@/service/utils/FunctionQueue'
export class Client {
    client: SupabaseClient;
    cache: CacheType;
    functionQueue: FunctionQueue;
    id: string;
    constructor() {
        this.client = supabaseClient();
        this.cache = cache;
        this.functionQueue = new FunctionQueue();
        this.id = (Math.random() * 1000000000000).toFixed();
    }

    private changeEvent = (func: Function) => {
        func();
    }

    private listenForChange = (key: string, func: Function) => {
        this.cache.onChange(key, () => this.changeEvent(func), this.id)
    }


    private fetchFunction = async ({
        queryKey,
        queryFunc,
        onChange
  
        
    }: {
        queryKey: string;
        queryFunc: Function;
        onChange: Function
    
        
    }) => {
    const cachedValue = this.cache.get(queryKey)
        if (cachedValue) {
            onChange(cachedValue);
            return;
        }
            const returnVal = await queryFunc();
            this.cache.set(queryKey, returnVal);
            onChange(this.cache.get(queryKey))
        
    }

    public fetch = async ({
        queryKey,
        queryFunc,
        onChange
  
        
    }: {
        queryKey: string;
        queryFunc: Function;
        onChange: Function;
    
        
    }) => {
       
        await this.functionQueue.add(async () => await this.fetchFunction({
            queryKey,
            queryFunc,
            onChange

        }))
        setTimeout(() => {
            this.listenForChange(queryKey, async () => await this.fetch({
                queryKey,
                queryFunc,  
                onChange
            }))
        }, 1)
        

        return this.cache.get(queryKey)
       
    }


}