import { SupabaseClient } from "@supabase/supabase-js";
import {Cache as CacheClass} from '@/service/cache'

import cache from '@/service/cache';

import {
    getTeam,
    getTeamAvatar
} from '@/business/api/fetch'

import {
    createTeam,
    updateTeam,
    updateTeamAvatar
} from '@/business/api/mutate'



export default class GatewayService {
    client: SupabaseClient;
    cache: CacheClass;
    constructor(supabaseService: SupabaseClient) {
        this.client = supabaseService.supabase;
        this.cache = cache;
    }
    
    createTeam(...params) {
        return createTeam(this.client, ...params)
    }

    getTeam(...params) {
        return getTeam(this.client, ...params)
    }


    updateTeamAvatar(...params) {
        return updateTeamAvatar(this.client, ...params)
    }

    updateTeam(...params) {
        return updateTeam(this.client, ...params)
    }
    
}