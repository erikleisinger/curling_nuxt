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


    private fetchFunction = ({
        queryKey,
        queryFunc,
        changeListener
  
        
    }: {
        queryKey: string;
        queryFunc: Function;
        changeListener: Function
    
        
    }) => {
    const cachedValue = this.cache.get(queryKey)
        if (cachedValue) {
            changeListener(cachedValue)
            return;
        }
            const returnVal = queryFunc();
            this.cache.set(queryKey, returnVal);
            changeListener(returnVal)
        
    }

    public fetch = ({
        queryKey,
        queryFunc,
        changeListener
  
        
    }: {
        queryKey: string;
        queryFunc: Function;
        changeListener: Function;
    
        
    }) => {
        this.functionQueue.add(async () => this.fetchFunction({
            queryKey,
            queryFunc,
            changeListener: changeListener
        }))
        this.listenForChange(queryKey, () => this.fetch({
            queryKey,
            queryFunc,  
            changeListener
        }))
    }


}