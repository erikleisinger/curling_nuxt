import { defineStore } from 'pinia';
import { TABLE_NAMES } from '@/constants/tables';
import {useBannerStore } from '@/store/banner'
import { useStorage } from '@vueuse/core'

type DataStoreState = {
    players: object[],
    shotTypes: object[],
};

export const useDataStore = defineStore('data', {
    state: () => 
        ({
            players: [],
            shotTypes: useStorage('shotTypes', []),
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
            if (this.players?.length) return;
            await this.fetchPlayers();

        },
        async fetchShotTypes() {
            const client = useSupabaseAuthClient();
            const {data} = await client.from(TABLE_NAMES.SHOT_TYPES).select('*');
           const errors = false;
            if (errors) {
                const bannerStore = useBannerStore();
                bannerStore.setText('Error getting shot types.')
            } else if (data) {
                const shotTypes = data.map((st) => {
                    const {id, name} = st;
                    return {
                        value: id,
                        label: name,
                    }
                })
                this.shotTypes = shotTypes;
            }
        },
        async getShotTypes() {
            if (this.shotTypes?.length) return;
            await this.fetchShotTypes()
        }
    }
})