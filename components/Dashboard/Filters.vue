<template>
    <div class="row no-wrap justify-center team-filters__container">
        <div
            class="avatar-container"
            v-for="team in teams"
            :key="team.id"
            @click="selectTeam(team.id)"
        >
            <TeamAvatar
                :teamId="team.id"
                :color="filters.teams.includes(team.id) ? 'mint' : ''"
                animateRing
            />
        </div>
        <Button round icon="add" size="15px" color="white" text-color="mint" @click="navigateTo('/teams/create')"/>
    </div>
    <div class="full-width filters__container">
        <!-- <div class="full-width row justify-center">
            <Button @click="revealed = !revealed">Filter</Button>
        </div>
        <div
            v-if="revealed"
            class="filters__container--inner "
        >
         <div class="row align-center justify-between full-width filter-row">
                <div class="row items-center">
                    <Rings
                        size="1.4em"
                        class="q-mr-sm"
                        :twelveft="color"
                        :fourft="color"
                        :eightft="getColor('royalBlue')"
                        :buttonft="getColor('royalBlue')"
                    />
                    <h3>Teams</h3>
                </div>
                <div class="row no-wrap avatar-row">
                    <div class="avatar-container" v-for="team in teams" :key="team.id" @click="selectTeam(team.id)">
                        <TeamAvatar :teamId="team.id" :color="filters.teams.includes(team.id) ? 'mint': ''" animateRing/>
                    </div>
                </div>
            </div>
            <div class="row align-center justify-between full-width filter-row">
                <div class="row items-center">
                    <Rings
                        size="1.4em"
                        class="q-mr-sm"
                        :twelveft="color"
                        :fourft="color"
                        :eightft="getColor('royalBlue')"
                        :buttonft="getColor('royalBlue')"
                    />
                    <h3>Sheet</h3>
                </div>
                <div class="text-caption" style="line-height: 1.9">
                    Coming soon
                </div>
            </div>
        </div> -->
    </div>
</template>
<style lang="scss" scoped>
.filters__container {
    .filters__container--inner {
        margin-top: var(--space-sm);
        background-color: rgba(0, 0, 0, 0.15);
    }
    .filter-row {
        &:not(:first-child) {
            margin-top: var(--space-md);
        }
    }
}

.team-filters__container {

    // background-color: $app-royal-blue;
    padding: var(--space-sm);
    z-index: 1;
     gap: var(--space-sm);

       
        .avatar-container {
            width: 45px;
        }
    
}
</style>
<script setup>
import { STAT_COLORS } from "@/constants/stats";
import Team from "@/store/models/team";
const props = defineProps({
    modelValue: Object,
    statType: String,
});

const emit = defineEmits(["update:modelValue"]);

const filters = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});
const revealed = ref(false);

const { getColor } = useColor();

const color = getColor("yellow");

const { userTeamIds } = useTeam();

const teams = computed(() =>
    useRepo(Team).query().whereIn("id", userTeamIds.value).get()
);

const selectTeam = (teamId) => {
    if (filters.value.teams.includes(teamId)) {
        filters.value.teams = [];
    } else {
        filters.value.teams = [teamId];
    }

    // const index = filters.value.teams.indexOf(teamId);
    // if (index === - 1) {
    //     filters.value.teams.push(teamId)
    // } else {
    //     filters.value.teams.splice(index, 1)
    // }
};
</script>
