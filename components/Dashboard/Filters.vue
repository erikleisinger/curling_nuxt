<template>
    <div class="team-filters__scroller hide-scroll">
        <div class="row no-wrap team-filters__container">
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
            <Button
                round
                icon="add"
                size="15px"
                color="white"
                text-color="mint"
                @click="navigateTo('/teams/create')"
            />
        </div>
    </div>
    <div class="full-width filters__container">
        <div class="full-width row justify-center">
            <Button @click="revealed = !revealed" flat color="mint"
                ><Rings
                    class="q-mr-xs"
                    size="16px"
                    :twelveft="revealed ? getColor('mint') : 'white'"
                    :eightft="
                        revealed ? getColor('white') : getColor('royalBlue')
                    "
                    :fourft="revealed ? getColor('mint') : 'white'"
                    :buttonft="
                        revealed ? getColor('white') : getColor('royalBlue')
                    "
                />
                <span :style="{ color: revealed ? getColor('mint') : 'white' }">
                    {{ revealed ? "Show less filters" : "Show more filters" }}
                </span></Button
            >
        </div>
        <div v-if="revealed" class="filters__container--inner">
            <div class="row items-center justify-between full-width filter-row">
                <div class="row items-center">
                    <Button flat color="mint" dense @click="rinkFilterClick">
                        <Rings
                            size="1.4em"
                            class="q-mr-sm"
                            :twelveft="selectedRink ? color : 'white'"
                            :fourft="selectedRink ? color : 'white'"
                            :eightft="
                                selectedRink ? 'white' : getColor('royalBlue')
                            "
                            :buttonft="
                                selectedRink ? 'white' : getColor('royalBlue')
                            "
                        />
                        <h3>Rink</h3>
                    </Button>
                </div>
                <div class="row">
                <div class="text-caption" style="line-height: 1.9">
                    {{ selectedRink?.name }}
                </div>
                <div v-if="selectedRink">
                    <Button  round icon="edit" color="mint"  size="8px" class="q-ml-sm" @click="searchRink"/>
                </div>
                </div>
            </div>
            <div class="row align-center justify-between full-width filter-row">
                <div class="row items-center">
                    <Button flat color="mint" dense @click="sheetFilterClick">
                        <Rings
                            size="1.4em"
                            class="q-mr-sm"
                           :twelveft="filters.sheet ? color : 'white'"
                            :fourft="filters.sheet ? color : 'white'"
                            :eightft="
                                filters.sheet ? 'white' : getColor('royalBlue')
                            "
                            :buttonft="
                                filters.sheet ? 'white' : getColor('royalBlue')
                            "
                            @click="sheetFilterClick"
                        />
                        <h3>Sheet</h3>
                    </Button>
                </div>
                <div class="text-caption" style="line-height: 1.9">
                    <DashboardFiltersSheetSelect :rinkId="selectedRink?.id" v-if="selectedRink?.id" v-model="filters.sheet"/>
                 
                </div>
            </div>
            <div class="row align-center justify-between full-width filter-row">
                <div class="row items-center">
                    <Button flat color="mint" dense>
                        <Rings
                            size="1.4em"
                            class="q-mr-sm"
                            :twelveft="color"
                            :fourft="color"
                            :eightft="getColor('white')"
                            :buttonft="getColor('white')"
                        />
                        <h3>Opposition</h3>
                    </Button>
                </div>
                <div class="text-caption" style="line-height: 1.9">
                    Coming soon
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.filters__container {
    max-width: 100%;

    .filters__container--inner {
        margin-top: var(--space-sm);
        background-color: rgba(0, 0, 0, 0.15);
        padding: var(--space-sm);
    }
    .filter-row {
        &:not(:first-child) {
            margin-top: var(--space-md);
        }
    }

}
.team-filters__scroller {
    max-width: 100%;
    overflow: auto;
    padding: var(--space-sm);
}
.team-filters__container {
    z-index: 1;
    gap: var(--space-sm);

    .avatar-container {
        width: 45px;
        min-width: 45px;
    }
}
</style>
<script setup>
import { STAT_COLORS } from "@/constants/stats";
import {useDialogStore} from '@/store/dialog'
import Team from "@/store/models/team";
import Player from "@/store/models/player";
import Rink from "@/store/models/Rink";
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

const color = getColor("mint");

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
};

const sheetFilterClick = () => {
    if (filters.value.sheet) filters.value.sheet = null;
};

const { user: userId } = useUser();
const currentUser = computed(() =>
    useRepo(Player).where("id", userId.value).first()
);

const rinkFilterClick = () => {
    if (filters.value.rink) {
        filters.value.rink = null;
        return;
    }

    if (filters.value?.teams?.length) {
  
        const [selectedTeamId] = filters.value.teams;
        const rinkId = teams.value.find(
            ({ id }) => id === selectedTeamId
        )?.rink_id;
            console.log('rinkId: ', rinkId)
        filters.value.rink = rinkId;
    } else {
        const rinkId = currentUser.value.rink_id;
        console.log('rinkId user: ', rinkId)
        filters.value.rink = rinkId;
    }
};

const selectedRink = computed(() =>
    useRepo(Rink).where("id", filters.value.rink).first()
);

const searchRink = () => {
    useDialogStore().toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ['rink'],
            inputLabel: 'Search for a rink',
            callback: (val) => {
                const {id} = val;
                filters.value.rink = id;
            }
        }
    })
}
</script>
