<template>
    <div class="team-filters__scroller hide-scroll" ref="container">
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
                id="dashboard-add-team-button"
            >
                <q-menu
                    auto-close
                    v-model="addTeamMenuOpen"
                    id="dashboard-add-team-menu"
                >
                    <q-list separator>
                        <q-item
                            clickable
                            v-ripple
                            @click="navigateTo('/teams/create')"
                        >
                            <q-item-section avatar>
                                <q-icon
                                    name="add"
                                    :style="{ color: getColor('mint') }"
                                />
                            </q-item-section>
                            <q-item-section no-wrap>
                                <q-item-label> Create new team </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-ripple @click="searchTeam">
                            <q-item-section avatar>
                                <q-icon name="search" />
                            </q-item-section>
                            <q-item-section no-wrap>
                                <q-item-label> Search for a team </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </Button>
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
                </span>
                <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                 <q-badge floating left  v-if="numFilters" rounded :style="{backgroundColor: getColor('red'), top: 0, right: '4px'}" align="bottom">
                    {{numFilters}}
                </q-badge>
                </transition>
                
                </Button
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
                        <Button
                            round
                            icon="edit"
                            color="mint"
                            size="8px"
                            class="q-ml-sm"
                            @click="searchRink"
                        />
                    </div>
                </div>
            </div>
 <transition appear enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight" mode="out-in">
            <div class="row align-center justify-between full-width filter-row" v-if="selectedRink">
                <div class="row items-center" >
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
                    <DashboardFiltersSheetSelect
                        :rinkId="selectedRink?.id"
                        v-if="selectedRink?.id"
                        v-model="filters.sheet"
                    />
                </div>
            </div>
 </transition>
            <div class="row align-center justify-between full-width filter-row">
                <div class="row items-center">
                    <Button flat color="mint" dense @click="onTimeRangeClick">
                        <Rings
                            size="1.4em"
                            class="q-mr-sm"
                            :twelveft="filters.start ? color : 'white'"
                            :fourft="filters.start ? color : 'white'"
                            :eightft="
                                filters.start ? 'white' : getColor('royalBlue')
                            "
                            :buttonft="
                                filters.start ? 'white' : getColor('royalBlue')
                            "
                        />
                        <h3>Time range</h3>
                    </Button>
                </div>
                 <div class="row items-center">
                    <div class="text-caption" style="line-height: 1.9">
                        {{ selectedTimeOption?.text }}
                    </div>
                    <div v-if="filters.start">
                        <Button
                            round
                            icon="edit"
                            color="mint"
                            size="8px"
                            class="q-ml-sm"
                            
                        >
                <q-menu auto-close>
                    <q-list separator>
                        <q-item v-for="option in timeOptions" :key="option.value" clickable v-ripple @click="onTimeOptionClick(option)">
                            <q-item-section no-wrap>
                                <q-item-label>
                                    {{option.text}}
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
                        </Button>
                    </div>
                </div>
            </div>
            <div class="row align-center justify-between full-width filter-row">
                <div class="row items-center">
                    <Button flat color="mint" dense>
                        <Rings
                            size="1.4em"
                            class="q-mr-sm"
                            :twelveft="'white'"
                            :fourft="'white'"
                            :eightft="getColor('royalBlue')"
                            :buttonft="getColor('royalBlue')"
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
    &.stick {
        background-color: white;
    }
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
import { useDialogStore } from "@/store/dialog";
import { useSessionStore } from "@/store/session";
import Team from "@/store/models/team";
import Player from "@/store/models/player";
import Rink from "@/store/models/rink";
import { useThrottleFn, useElementSize, useScroll } from "@vueuse/core";
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
        filters.value.rink = rinkId;
    } else {
        const rinkId = currentUser.value.rink_id;
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
            resourceTypes: ["rink"],
            inputLabel: "Search for a rink",
            callback: (val) => {
                const { id } = val;
                filters.value.rink = id;
            },
        },
    });
};

const searchTeam = () => {
    useDialogStore().toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ["team"],
            inputLabel: "Search for a team",
            callback: (val) => {
                const { id } = val;
                return navigateTo(`/teams/${id}?request=true`);
            },
        },
    });
};

const addTeamMenuOpen = ref(false);
watch(addTeamMenuOpen, (val) => {
    useSessionStore().toggleAddTeamMenu(val);
});

const {toTimezone} = useTime();

const timeOptions = computed(() => (
    [
    {
        text: 'Past week',
        value: toTimezone(null, null, false, true).subtract(1, 'week').unix()
    },
    {
        text: 'Past month',
        value: toTimezone(null, null, false, true).subtract(1, 'month').unix()
    },
]
))

const selectedTimeOption = computed(() => timeOptions.value.find(({value}) => value === filters.value.start))

const onTimeRangeClick = () => {
    if (filters.value.start) {
        filters.value.start = null;
    } else {
        filters.value.start = timeOptions.value[0].value
    }
}

const onTimeOptionClick = (option) => {
    filters.value.start = option.value
}

const numFilters = computed(() => {
    return [
        filters.value.opposition,
        filters.value.rink,
        filters.value.sheet,
        filters.value.start
    ].filter((val) => !!val)?.length
})
</script>
