<template>
    <q-dialog v-model="isOpen" @hide="emit('close')">
        <q-card style="width: 100%">
            <q-card-section class="q-pt-xs"> 
                <div v-if="!stats">LOADING</div>
                <div v-else class="stats__container">
                    <label class="truncate-text q-my-md" style="font-weight: bold; font-size: 1.5em" >{{stats.home.name}}</label>
                    <label class="text-right truncate-text q-my-md" style="font-weight: bold; font-size: 1.5em">{{stats.away.name}}</label>
                    <TeamStats class="col-6 q-mr-xs" :color="stats.home_color" :stats="{
                        total: stats.home_percentage,
                        fourth: stats.home_percentage_fourth,
                        third: stats.home_percentage_third,
                        second: stats.home_percentage_second,
                        lead: stats.home_percentage_lead
                    }"/>
                      <TeamStats class="col-6 q-ml-xs" :color="stats.away_color" reverse :stats="{
                        total: stats.away_percentage,
                        fourth: stats.away_percentage_fourth,
                        third: stats.away_percentage_third,
                        second: stats.away_percentage_second,
                        lead: stats.away_percentage_lead
                    }"/>
                </div>
                 </q-card-section>
            <slot name="buttons">
                <q-card-actions align="right" class="row justify-between">
                    <q-btn
                        flat
                        label="Close"
                        @click="emit('close')"
                        v-close-popup
                    ></q-btn>
                </q-card-actions>
            </slot>
        </q-card>
    </q-dialog>
</template>
<style lang="scss" scoped>
    .stats__container {
        display: grid;
        grid-template-columns: repeat(2, 50%);
        grid-template-rows: repeat(2, auto);
    }
</style>
<script setup >
const props = defineProps({
    gameId: Number,
});
const isOpen = ref(true);
const emit = defineEmits(["close", "save"]);
const stats = ref(null)
onMounted(async () => {
    if (!props.gameId) return;
    const client = useSupabaseClient();
    const {data} = await client.rpc("get_game_stats", {
        game_id_param: props.gameId,
    });
    stats.value = data[0];
});
</script>
