import { defineStore } from 'pinia';
import { TABLE_NAMES } from '@/constants/tables';
import {useBannerStore } from '@/store/banner'

type DataStoreState = {
    players: object[],
};

export const useDataStore = defineStore('data', {
    state: () => 
        ({
            players: []
        } as DataStoreState),
    actions: {
        async fetchPlayers() {
            const client = useSupabaseAuthClient();
            const {data} = await client.from(TABLE_NAMES.PLAYERS).select('*');
           const errors = false;
            if (errors) {
                const bannerStore = useBannerStore();
                bannerStore.setText('Error getting players.')
            } else if (data) {
                const {formatPlayerForSelection} = useFormat();
                this.players = data.map((d) => formatPlayerForSelection(d))
            }
        },
        async getPlayers() {
            if (this.players?.length) return this.players;
            await this.fetchPlayers();

        }
    }
})