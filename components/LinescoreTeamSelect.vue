<template>
<!-- :class="{confirm: selections.home && selections.away}" -->
<div class="linescore-teamselect__container" >
    <div class="inner__container" >
    <transition
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
    >
        <ProfileCard
            animated
            :type="homeTeam ? 'team' : ''"
            v-if="selections.home && selections.away"
            :avatar="selections?.home?.team_avatar"
        >
            <span class="text-bold">
                {{ selections?.home?.name }}
            </span>

            <template v-slot:append>
                <div style="max-width: 3em">
                    <!-- :prevent="[awayColor]" -->
                    <SelectColor v-model="selections.homeColor" v-if="selections.home && selections.away"/>
                </div>
            </template>
        </ProfileCard>
    </transition>
       <transition
        appear
        enter-active-class="animated slideInLeft"
        leave-active-class="animated slideOutLeft"
    >
    <div v-if="selections.home && selections.away" class="versus row justify-center items-center">VS</div>
       </transition>
    <transition
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
    >
        <ProfileCard
            animated
            v-if="selections.away"
            :avatar="selections?.away?.team_avatar"
        >
            <span class="text-bold">
                {{ selections?.away?.name }}
            </span>
            <template v-slot:append>
                <div style="max-width: 3em">
                    <!-- :prevent="[homeColor]" -->
                    <SelectColor v-model="selections.awayColor" v-if="selections.home && selections.away"/>
                </div>
            </template>
        </ProfileCard>
    </transition>

    <TeamList :teams="teams" v-if="teams?.length && (!selections.home || !selections.away)" @select="onSelect" />

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
        .versus {
            height: 3em;
            width: 100%;
            font-size: var(--text-lg);
            font-weight: bold;
            font-style: italic;
        }
    }
</style>
<script setup>
import { useTeamStore } from "@/store/teams";
import { useEditorStore } from "@/store/editor";

const { toggleLineScore } = useEditorStore();

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

onMounted(() => {
    const teamStore = useTeamStore();
    teams.value = [...teamStore.teams];
});

const homeTeam = ref(null);
const awayTeam = ref(null);

const homeColor = ref("yellow");
const awayColor = ref(null);
const teams = ref([]);

const onSelect = (_, _1, team) => {
    if (!selections.value.home) {
        selections.value.home = team;
    } else if (!selections.value.away) {
        selections.value.away = team;
    }
};

const steps = {
    SELECT_HOME: 0,
    SELECT_AWAY: 1,
};

const step = ref(steps.SELECT_HOME);

const emit = defineEmits(["update:modelValue", "close"]);
</script>
