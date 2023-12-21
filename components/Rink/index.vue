<template>
    <div class="rink__container" v-if="!isLoading">
        <header class="column justify-end rink--header" ref="header">
            <q-img
                class="rink-img"
                :src="defaultAvatar"
                spinner-color="white"
                height="100%"
            ></q-img>
            <div class="rink-header__content">
                <h1 class="text-md text-bold ">{{ rink.name }}</h1>
                <div class="row justify-between">
                <h3 class="text-sm">{{rink.city}}, {{rink.province}}</h3>
                <h3 class="text-sm">{{rink.sheets}} sheets</h3>
                </div>
            
            </div>
        </header>
        <nav class="rink-nav" ref="nav">
              <q-tabs
                v-model="currentIndex"
                stretch
            
            >
                <q-tab label="Teams" :name="0"  />
                <q-tab label="Leagues" :name="1"/>
                 <q-tab label="Bonspiels" :name="2" :disable="true"/>
            
            </q-tabs>
        </nav>
        <main class="rink__content--container">
            <RinkTeams v-if="currentIndex === 0" :id="rinkId"/>
        </main>

    </div>
</template>
<style lang="scss" scoped>
.rink__container {
    height: 100%;
    width: 100%;
    .rink--header {
        height: 200px;
        @include sm {
            height: 300px;
        }
        position: relative;
        .rink-img {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            z-index: 0;
        }
        .rink-header__content {
            z-index: 1;
            width: fit-content;
                background-color: rgba(0,0,0,0.6);
                padding: 4px;
                border-top-right-radius: 8px;
                 color: white;
            h1 {
               
                
                font-size: var(--text-xl);
                @include sm {
                     font-size: var(--text-xxxl);
                }

            }
        }
    }

    .rink-nav {
        position: sticky;
        top: 0;
        z-index: 2;
        background-color: white;
        box-shadow: $pretty-shadow;
    }

    .rink__content--container {
        min-height: v-bind(mainHeight)
    }
}
</style>
<script setup>
import { useQuery } from "@tanstack/vue-query";
import Rink from '@/store/models/rink';
import {useElementBounding} from '@vueuse/core'

const defaultAvatar = new URL("~/assets/rink.jpg", import.meta.url).href;

const route = useRoute();
const rinkId = Number(route.params.id);

const getRink = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("rinks")
        .select("*")
        .eq("id", rinkId)
        .single();
        useRepo(Rink).save(data)
    return data;
};

const { isLoading, data: rink } = useQuery({
    queryKey: ["rink", rinkId],
    queryFn: getRink,
    refetchOnWindowFocus: false,
    select: (val) => {
        const { setLoading } = useLoading();
        setLoading(false);
        return val;
    },
});

// Tabs
const currentIndex = ref(0)


// Main height calc

const header = ref(null);
const nav = ref(null);

const {height: headerHeight} = useElementBounding(header);
const {height: navHeight} = useElementBounding(nav);

const $q = useQuasar();

const mainHeight = computed(() => `calc((100 * var(--vh, 1vh)) - ${headerHeight.value + navHeight.value}px - ${$q.screen.xs ? 50 : 65}px)`)
</script>
<script>
export default {
    name: 'Rink',
}
</script>
