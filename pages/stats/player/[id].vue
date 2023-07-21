<template>
    <NuxtLayout name="main">
        <q-scroll-area>
            <div class="player-stats__container">
                <header
                    class="q-pa-lg column justify-center items-center no-wrap"
                >
                    <!-- <div class="profile-picture row justify-center items-center">
                <q-icon name="person" size="md" color="grey"/>
            </div> -->
                    <div style="" class="column items-center">
                        <StatsWheel
                            :value="getPercent(data[dataMap.TOTAL])"
                            size="150px"
                            label="Total"
                        />
                    </div>
                    <h1 class="q-mt-xs text-black">
                        {{ getPlayerName(Number(route.params.id)) }}
                    </h1>
                    <!-- <h2></h2> -->

                    <!-- <q-chip icon="content_copy">Friend ID</q-chip> -->
                </header>
                <main class="main-content__wrap">
                    <div class="main-percent__container">
                         <div
                            class="column items-between justify-center q-mb-xl q-mr-sm"
                        >
                            <StatsWheel
                                :value="getPercent(data[dataMap.TOTAL])"
                                size="150px"
                                color="primary"
                                label="Total"
                            />
                        </div>
                        <div class="column items-center q-mb-xl q-ml-sm">
                            <percentage
                                :percent="data[dataMap.INSIDE]"
                                color="amber"
                                reverse
                                label="Inside"
                                  static
                            />
                            <percentage
                               :percent="data[dataMap.ON_BROOM]"
                                color="pink"
                                reverse
                                label="On broom"
                                  static
                            />
                            <percentage
                                :percent="data[dataMap.OUTSIDE]"
                                color="teal"
                                reverse
                                label="Outside"
                                  static
                            />
                        </div>
                        <div
                            class="column items-between justify-center q-mb-xl q-mr-sm"
                        >
                            <StatsWheel
                                :value="getPercent(data[dataMap.INTURN])"
                               size="150px"
                                color="accent"
                                label="Inturn"
                            />
                        </div>
                        <div class="column items-center q-mb-xl q-ml-sm">
                            <percentage
                                :percent="50"
                                color="amber"
                                reverse
                                label="Inside"
                                  static
                            />
                            <percentage
                                :percent="50"
                                color="pink"
                                reverse
                                label="On broom"
                                  static
                            />
                            <percentage
                                :percent="50"
                                color="teal"
                                reverse
                                label="Outside"
                                  static
                            />
                        </div>
                        <div
                            class="column items-between justify-center q-mb-xl q-mr-sm"
                        >
                            <StatsWheel
                                :value="getPercent(data[dataMap.OUTTURN])"
                                size="150px"
                                color="indigo"
                                label="Outturn"
                            />
                        </div>
                        <div class="column items-center q-mb-xl q-ml-sm">
                            <percentage
                                :percent="50"
                                color="amber"
                                reverse
                                label="Inside"
                                  static
                            />
                            <percentage
                                :percent="50"
                                color="pink"
                                reverse
                                label="On broom"
                                  static
                            />
                            <percentage
                                :percent="50"
                                color="teal"
                                reverse
                                label="Outside"
                                  static
                            />
                        </div>
                        <div
                            class="column items-between justify-center q-mb-xl q-mr-sm"
                        >
                            <StatsWheel
                                :value="getPercent(data[dataMap.DRAW])"
                                 size="150px"
                                color="orange"
                                label="Draw"
                                  static
                            />
                        </div>
                        <div class="column items-center q-mb-xl q-ml-sm">
                            <percentage
                                :percent="50"
                                color="amber"
                                reverse
                                label="Inside"
                                  static
                            />
                            <percentage
                                :percent="50"
                                color="pink"
                                reverse
                                label="On broom"
                                  static
                            />
                            <percentage
                                :percent="50"
                                color="teal"
                                reverse
                                label="Outside"
                                static
                            />
                        </div>
                        <div
                            class="column items-between justify-center q-mb-xl q-mr-sm"
                        >
                            <StatsWheel
                                :value="getPercent(data[dataMap.HIT])"
                              size="150px"
                                color="positive"
                                label="Hit"
                            />
                        </div>
                        <div class="column items-center q-mb-xl q-ml-sm">
                            <percentage
                                :percent="50"
                                color="amber"
                                reverse
                                label="Inside"
                                  static
                            />
                            <percentage
                                :percent="50"
                                color="pink"
                                reverse
                                label="On broom"
                                  static
                            />
                            <percentage
                                :percent="50"
                                color="teal"
                                reverse
                                label="Outside"
                                  static
                            />
                        </div>
                    </div>
                    <!-- <div class="line__container">
                       <div class="column items-center">
                            <StatsWheel :value="data[dataMap.INSIDE]" size="65px" label="inside" color="light-blue-6" />
                           
                            </div>
                          <div class="column items-center">
                            <StatsWheel :value="data[dataMap.ON_BROOM]" size="65px" label="on broom" color="light-blue-8"  />
                          
                            </div>
                             <div class="column items-center">
                            <StatsWheel :value="data[dataMap.OUTSIDE]" size="65px" label="outside" color="light-blue-10"  />
                         
                            </div>
                    </div> -->
                </main>
            </div>
        </q-scroll-area>
    </NuxtLayout>
</template>
<style scoped lang="scss">
.player-stats__container {
    display: grid;
    grid-template-rows: minmax(300px, 20vh) 1fr;
    grid-template-columns: 1fr;
    header {
        position: relative;
        z-index: 1;

        .profile-picture {
            height: 100px;
            width: 100px;
            border: 1px solid #ddd;
            border-radius: 50%;
            background: #eee;
        }
        h2 {
            color: rgba(0, 0, 0, 0.7);
        }
    }
    .main-content__wrap {
        background-color: white;
        min-height: calc(90vh - 50px);
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-top-left-radius: 32px;
        border-top-right-radius: 32px;
        margin: 0px 8px;
        padding: 32px;

        .main-percent__container {
            display: grid;
            grid-template-columns: auto minmax(0, auto);
            grid-template-rows: 1fr auto auto;
        }
        .line__container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            margin-top: 32px;
        }
    }
}
</style>
<script setup>
import { usePlayerStore } from "@/store/players";
const route = useRoute();
const loading = ref(false);

const client = useSupabaseAuthClient();
const { data: d } = await client.rpc("get_shot_averages", {
    player_id_param: route.params.id,
});
const [data] = d || [{}];

const dataMap = {
    TOTAL: "avg_score",
    INTURN: "avg_inturn",
    OUTTURN: "avg_outturn",
    DRAW: "avg_draw",
    HIT: "avg_hit",
    INSIDE: "avg_inside",
    ON_BROOM: "avg_onbroom",
    OUTSIDE: "avg_outside",
};

const { getPercent } = useConvert();
const store = usePlayerStore();
const { getPlayerName } = store;
</script>
