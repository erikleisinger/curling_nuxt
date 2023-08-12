<template>
    <div class="player__select--wrap" :style="{ backgroundColor: getColor(color) }">
        <div class="player__position truncate-text">Lead</div>
        <!-- <div class="player__name">Unnamed player</div> -->
        <SelectResource
            :fallback="`${props.defaultPrefix} lead`"
            :options="options"
            v-model="team.lead"
            color="rgba(0,0,0,0.3)"
               style="color: white"
            eager
        />
        <!-- <q-checkbox
            v-model="leadSkip"
            @update:model-value="setSkip('lead')"
            checked-icon="star"
            unchecked-icon="grade"
            size="3em"
            dense
              color="yellow"
        /> -->
        <div class="player__position truncate-text">Second</div>
        <SelectResource
              :fallback="`${props.defaultPrefix} second`"
            :options="options"
            v-model="team.second"
            color="rgba(0,0,0,0.3)"
            style="color: white"
            eager
        />
        <!-- <q-checkbox
            v-model="secondSkip"
            @update:model-value="setSkip('second')"
            checked-icon="star"
            unchecked-icon="grade"
            size="3em"
            dense
            color="yellow"
        /> -->
        <div class="player__position truncate-text">Third</div>
        <SelectResource
              :fallback="`${props.defaultPrefix} third`"
            :options="options"
            v-model="team.third"
            color="rgba(0,0,0,0.3)"
            eager
        />
        <!-- <q-checkbox
            v-model="thirdSkip"
            @update:model-value="setSkip('third')"
            checked-icon="star"
            unchecked-icon="grade"
            size="3em"
            dense
              color="yellow"
        /> -->
        <div class="player__position truncate-text">Fourth</div>
        <SelectResource
               :fallback="`${props.defaultPrefix} fourth`"
            :options="options"
            v-model="team.fourth"
            color="rgba(0,0,0,0.3)"
            eager
        />

    </div>
</template>
<style lang="scss" scoped>
.player__select--wrap {
    width: 100%;
    height: 100%;
    border-radius: var(--space-sm);
    border: 1px solid var(--transparent-light);
    padding: var(--space-sm);
    position: relative;
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    grid-template-columns: minmax(60px, 2em) auto;
    row-gap: var(--space-xs);
    color: white;
    .player__position,
    .player__name {
        display: flex;
        align-items: center;
    }
    .player__name {
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: var(--space-xs);
        padding-right: var(--space-xs);
        padding-left: var(--space-xs);
    }
}
</style>
<script setup>
import { useTeamStore } from "@/store/teams";
import { usePlayerStore } from "@/store/players";
const props = defineProps({
    color: String,
    defaultPrefix: {
        type: String,
        default() {
            return 'Unnamed'
        }
    },
    modelValue: Object,
    teamId: Number,
});

const emit = defineEmits(['update:modelValue'])

const team = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', {
            lead: lead.value,
            second: second.value,
            third: third.value,
            fourth: fourth.value
        })
    }
})

const lead = ref(null);
const second = ref(null);
const third = ref(null);
const fourth = ref(null);

const leadSkip = ref(false);
const secondSkip = ref(false);
const thirdSkip = ref(false);
const fourthSkip = ref(true);

const setSkip = (pos) => {
    if (pos === 'lead') {
        leadSkip.value = true;
        secondSkip.value = false;
        thirdSkip.value = false;
        fourthSkip.value = false;
    } else if (pos === 'second') {
            leadSkip.value = false;
        secondSkip.value = true;
        thirdSkip.value = false;
        fourthSkip.value = false;
    }else if (pos === 'third') {
            leadSkip.value = false;
        secondSkip.value = false;
        thirdSkip.value = true;
        fourthSkip.value = false;
    } else if (pos === 'fourth') {
            leadSkip.value = false;
        secondSkip.value = false;
        thirdSkip.value = false;
        fourthSkip.value = true;
    }
}


const teamStore = useTeamStore();

const options = ref([]);



const getOptions = () => {
    if (!props.teamId) {
        const playerStore = usePlayerStore();
        const {formatPlayerForSelection} = useFormat();
        options.value = playerStore.players.map(formatPlayerForSelection)
    } else {

    
    const currentTeam = teamStore.teams.find((t) => t.id === props.teamId);
    if (!currentTeam) {
        options.value = [];
        return;
    }
    const {
        lead_player_id,
        second_player_id,
        third_player_id,
        fourth_player_id,
        fifth_player_id,
        sixth_player_id,
        seventh_player_id,
        lead_player_name,
        second_player_name,
        third_player_name,
        fourth_player_name,
        fifth_player_name,
        sixth_player_name,
        seventh_player_name,
    } = currentTeam;
    if (lead_player_name && lead_player_id ) {
        team.value.lead = {
            value: lead_player_id,
            label: lead_player_name
        }
    } else {
         team.value.lead = {
            value: 0,
            label: `${props.defaultPrefix} lead`
        }
    }
     if (second_player_name && second_player_id) {
        team.value.second = {
            value: second_player_id,
            label: second_player_name
        }
    }else {
         team.value.second = {
            value: 0,
            label: `${props.defaultPrefix} second`
        }
    }
     if (third_player_name && third_player_id) {
        team.value.third = {
            value: third_player_id,
            label: third_player_name
        }
    }else {
         team.value.third = {
            value: 0,
            label: `${props.defaultPrefix} third`
        }
    }
     if (fourth_player_name && fourth_player_id) {
        team.value.fourth = {
            value: fourth_player_id,
            label: fourth_player_name
        }
    }else {
         team.value.fourth = {
            value: 0,
            label: `${props.defaultPrefix} fourth`
        }
    }
    options.value = [
        {
            label: lead_player_name,
            value: lead_player_id,
        },
        {
            label: second_player_name,
            value: second_player_id,
        },
        {
            label: third_player_name,
            value: third_player_id,
        },
        {
            label: fourth_player_name,
            value: fourth_player_id,
        },
        {
            label: fifth_player_name,
            value: fifth_player_id,
        },
        {
            label: sixth_player_name,
            value: sixth_player_id,
        },
        {
            label: seventh_player_name,
            value: seventh_player_id,
        },
    ].filter(({ value }) => !!value);
    }
}

const id = computed(() => props.teamId);

watch(id, () => {
    getOptions();
}, {immediate: true})


const {getColor} = useColor()
</script>
