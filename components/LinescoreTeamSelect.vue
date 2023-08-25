<template>
<!-- :class="{confirm: selections.home && selections.away}" -->
<div class="linescore-teamselect__container" >
    <div class="inner__container" >

    
<KeepAlive>

    <TeamList :teams="teamOptions" v-if="teamOptions?.length " @select="onSelect" />
   
</KeepAlive>

    </div>
    </div>
</template>
<style lang="scss" scoped>
    .linescore-teamselect__container {
        height: 100%;
        width: 100%;
        &.confirm {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .inner__container {
            width: 100%;
            &.confirm {
                height: 50%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
            }
        }

    }
</style>
<script setup>
import { useTeamStore } from "@/store/teams";
import { useDialogStore } from "@/store/dialog";

const { toggleLineScore } = useDialogStore();

const props = defineProps({
    modelValue: Object,
});

const selections = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const teams = ref([])
const teamOptions =  computed(() => teams.value.filter((t) => t.id !== selections.value.home?.id))

// For now teams are generated; ultimately we want this to be a prop
// to allow for selecting my teams, other people's teams, etc
onMounted(() => {
    const teamStore = useTeamStore();
    teams.value = [...teamStore.teams];
});

const homeTeam = ref(null);
const awayTeam = ref(null);

const homeColor = ref("yellow");
const awayColor = ref(null);


const onSelect = (_, _1, team) => {
    selections.value.home = team;
      emit('select')
};

const steps = {
    SELECT_HOME: 0,
    SELECT_AWAY: 1,
};

const step = ref(steps.SELECT_HOME);

const emit = defineEmits(["select", "update:modelValue"]);
</script>
