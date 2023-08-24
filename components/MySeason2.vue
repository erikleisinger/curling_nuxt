<template>
    <div class="full-width container">
        <header>
            <div class="profile__wrap full-width">
                <ProfileCard :avatar="user.avatar">
                    {{ user.firstName }} {{ user.lastName }}
                    <template v-slot:subtitle> @{{ user.username }} </template>
                    <template v-slot:append>
                        <q-btn
                            flat
                            round
                            icon="logout"
                            @click="logout"
                            color="deep-purple"
                        />
                    </template>
                </ProfileCard>
            </div>
            <nav class="row justify-center">
                <q-btn-toggle
                    style=""
                    v-model="model"
                    class="page__select"
                    no-caps
                    rounded
                    unelevated
                    toggle-color="deep-purple"
                    color="white"
                    text-color="deep-purple"
                    spread
                    :options="[
                        { label: '', value: 'stats', slot: 'stats' },
                        { label: 'Schedule', value: 'games', slot: 'games' },
                    ]"
                >
                    <template v-slot:stats> Summary </template>
                </q-btn-toggle>
            </nav>
        </header>
        <div v-show="model === 'stats'" style="height: fit-content">
            <div ref="statsController">
                <!-- <transition-group appear enter-active-class="slideInLeft" leave-active-class="slideOutRight"> -->
                <StatsContainer v-if="view === 'gameResults'" key="gameResults">
                    <template v-slot:title> Season summary </template>
                    <ChartWinLossTie style="max-height: 250px" />
                </StatsContainer>
                <StatsContainer>
                    <template v-slot:title> Game averages </template>
                    <div class="row no-wrap items-center q-mt-md">
                        <div
                            class="q-mr-sm col-shrink"
                            style="max-width: 15vw; width: fit-content"
                        >
                            Points scored
                        </div>
                        <div class="col-grow"><ChartEitherOr /></div>
                    </div>
                    <div
                        class="row no-wrap items-center q-mt-md"
                        v-if="!loading"
                    >
                        <div
                            class="q-mr-sm col-shrink"
                            style="max-width: 15vw; width: fit-content"
                        >
                            hammer first end
                        </div>
                        <div class="col-grow">
                            <ChartEitherOr :datasets="datasets" />
                        </div>
                    </div>
                    <div class="row no-wrap items-center q-mt-md">
                        <div
                            class="q-mr-sm col-shrink"
                            style="max-width: 15vw; width: fit-content"
                        >
                            Hammer 1st end
                        </div>
                        <div class="col-grow">
                            <ChartEitherOr
                                :datasets="datasetsTwo"
                                :tooltipCallback="dataCallback"
                            />
                        </div>
                    </div>
                    <div class="row no-wrap items-center q-mt-md">
                        <div
                            class="q-mr-sm col-shrink"
                            style="max-width: 15vw; width: fit-content"
                        >
                            Hammer pos
                        </div>
                        <div class="col-grow">
                            <ChartEitherOr
                                :datasets="datasetsThree"
                                :tooltipCallback="dataCallback"
                            />
                        </div>
                    </div>
                </StatsContainer>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.profile__wrap {
    padding: var(--space-sm);
    border-bottom: 1px solid $grey-4;
}
:deep(.page__select) {
    width: 100%;
    max-width: 50vw;
    border: 1px solid $deep-purple;
}
.container {
    min-height: inherit;
    overflow: auto;
    max-height: calc((100 * var(--vh, 1vh) - 50px));
}
nav {
    margin-top: var(--space-md);
    margin-bottom: var(--space-md);
}
:deep(.slider) {
    .q-slider__selection {
        z-index: 3;
        background-color: rgba(55, 144, 233, 0.6);
    }
    .q-slider__track {
        border-radius: 16px;
        background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.4) 10px,
            rgba(255, 255, 255, 0.4) calc(2 * 10px)
        ) !important;

        &:after {
            content: "";
            position: absolute;
            height: 100%;
            width: 100%;
            background-color: rgba(240, 98, 146, 0.8);
            z-index: 0;
            border-radius: inherit;
        }
    }
}
</style>
<script setup>
import { useSwipe } from "@vueuse/core";
import { useNotificationStore } from "@/store/notification";
import { useUserStore } from "@/store/user";
import Chart from "chart.js/auto";
const model = ref("stats");

const view = ref("gameResults");

const VIEWS = ["gameResults", "overtime"];

const statsController = ref(null);

const stats = ref({
    total_ends_played: 0,
    hammer_ends_count: 0,
    hammer_steal_count: 0,
    hammer_blank_count: 0,
    hammer_1_point_count: 0,
    hammer_2_point_count: 0,
    hammer_3_point_count: 0,
    hammer_4_point_count: 0,
    hammer_5_point_count: 0,
    hammer_6_point_count: 0,
    hammer_7_point_count: 0,
    hammer_8_point_count: 0,
    stolen_end_count: 0,
    forced_end_count: 1,
    avg_points_conceded: 2.75,
});

const loading = ref(true);
onMounted(async () => {

    datasets.value = [
        {
            label: "Avg for",
            backgroundColor: "#f06292",
            barThickness: 15,
            data: [2.2],
        },
    ];
    loading.value = false;
});

const datasets = [
    {
        label: "Avg for",
        backgroundColor: "#f06292",
        barThickness: 15,
        data: [2.2],
    },
    {
        label: "Avg against",
        backgroundColor: "#ab47bc",
        barThickness: 15,
        data: [1],
    },
];

const datasetsTwo = [
    {
        label: "Won",
        backgroundColor: "#1b5e20",
        barThickness: 15,
        data: [55],
    },
    {
        label: "Lost",
        backgroundColor: "#66bb6a",
        barThickness: 15,
        data: [45],
    },
];

const datasetsThree = [
    {
        label: "Won",
        backgroundColor: "#1b5e20",
        barThickness: 15,
        data: [55],
    },
    {
        label: "Lost",
        backgroundColor: "#66bb6a",
        barThickness: 15,
        data: [45],
    },
];

const dataCallback = (data) => {
    return `32/54 games - ${data.formattedValue}%`;
};

const sliderModel = ref(6);
const goToView = (inc) => {
    const currentView = VIEWS.findIndex((v) => v === view.value);
    if (currentView === -1) return;
    if (currentView + inc < 0) return;
    if (currentView + inc > VIEWS.length - 1) return;
    view.value = VIEWS[currentView + inc];
};
const { direction } = useSwipe(statsController, {
    onSwipe: () => {
        if (direction.value === "right") {
            goToView(-1);
        } else if (direction.value === "left") {
            goToView(+1);
        }
    },
});

const userStore = useUserStore();
const user = computed(() => {
    const {
        id,
        timezone,
        friendId,
        username,
        player,
        firstName,
        lastName,
        avatar,
    } = userStore;
    return {
        id,
        timezone,
        friendId,
        username,
        player,
        firstName,
        lastName,
        avatar,
    };
});
const { logout } = useSession();
</script>
