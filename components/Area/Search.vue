<template>
    <!-- <Teleport to="body"> -->
    <div class="search-container--floating" ref="searchBar">
        <div class="search__container--floating">
            <q-input
                rounded
                outlined
                :label="inputLabel"
                color="deep-purple"
                v-model="searchInput"
                @keydown.enter="search"
                clearable
                @clear="clearResults"
                :loading="loading"
            >
                <!-- :hint="global && !hideHint ? 'Searching worldwide' : ''" -->
                <template v-slot:before v-if="!hideIcons">
                    <slot name="before"/>
                </template>
                <template v-slot:after>
                    <q-btn
                        flat
                        round
                        icon="search"
                        @click="emit('close')"
                        v-if="!hideIcons"
                    />
                </template>
            </q-input>
        </div>
        <!-- :style="{height: `calc(100% - ${searchBarHeight}px)`}" -->
        <div
            class="search-results__container z-top"
            :style="{
                top: `${searchBarY}px + ${searchBarHeight}px`,
                maxHeight: `calc(100 * var(--vh, 1vh) - (${searchBarY}px + ${searchBarHeight}px + 32px))`,
            }"
            v-if="results"
        >
        <div v-if="!results?.length" style="height: 50px" class="row justify-center items-center">
            No results.
        </div>
            <div v-for="result in results" :key="result.id" @click="emit('select', result)">
                <div class="result__container">
                    <!-- RINK result -->
                       <div v-if="result.resourcetype === 'rink'" class="icon__wrap">
                    <div
                        v-if="result.resourcetype === 'rink'"
                        class="row justify-center items-center icon__container"
                    >
                        <q-icon size="2em" name="location_on" color="red" />
                    </div>
                       </div>
                    <div
                        v-if="result.resourcetype === 'rink'"
                        class="column justify-center"
                    >
                        <div class="text-bold">{{ result.name }}</div>
                        <div class="text-sm">
                            {{ `${result.city}, ${result.province}` }}
                        </div>
                    </div>

                    <!-- TEAM result -->
                    <div v-if="result.resourcetype === 'team'">
                        <Avataaar v-bind="parseAvatar(result.avatar)" />
                    </div>
                    <div
                        v-if="result.resourcetype === 'team'"
                        class="column justify-center"
                    >
                        <div class="text-sm">Team</div>
                        <div class="text-bold">{{ result.name }}</div>
                    </div>
                    <!-- EVENT result -->
                    <div v-if="result.resourcetype === 'event'" class="icon__wrap">
                    <div
                       
                        class="row justify-center items-center icon__container"
                    >
                        <q-icon size="2em" name="emoji_events" color="yellow" />
                    </div>
                    </div>
                    <div
                        v-if="result.resourcetype === 'event'"
                        class="column justify-center"
                    >
                        <div class="text-bold">{{ result.name }}</div>
                        <div class="text-sm">{{ result.loc }}</div>
                        <div class="text-sm">
                            {{ `${result.city}, ${result.province}` }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- </Teleport> -->
</template>
<style lang="scss" scoped>
.search-container--floating {
    width: 100%;
    position: relative;
    padding: 0px var(--space-sm);
    .search-results__container {
        position: absolute;
        width: 100%;
        background-color: white;
        overflow: auto;
        margin-left: calc(var(--space-sm) * -1);
        .result__container {
            display: grid;
            grid-template-columns: 50px 1fr;
            padding: var(--space-xs);
            > div:nth-child(2) {
                margin-left: 16px;
            }
        }
        .icon__wrap {
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
              .icon__container {
            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            aspect-ratio: 1/1;
            width: 100%;
         
        }
        }
      
    }
    .search__container--floating {
        width: inherit;
        padding-top: var(--space-md);
        padding-bottom: var(--space-md);
        animation: expand 0.3s forwards;
        transform-origin: right;
        :deep(.q-field) {
            padding-bottom: 0px;
        }
        :deep(.q-field__before) {
            padding-right: var(--space-xxxs);
        }
        :deep(.q-field__bottom) {
            padding-top: var(--space-xxxs);
            .q-field__messages {
                color: $deep-purple;
                font-weight: bold;
            }
        }
    }
}

@keyframes expand {
    0% {
        transform: scaleX(0);
    }
    100% {
        transform: scaleX(1);
    }
}
</style>
<script setup>
import { useElementBounding, useThrottleFn } from "@vueuse/core";
import { parseAvatar } from "@/utils/avatar";

const props = defineProps({
    globalOnly: Boolean,
    hideHint: Boolean,
    hideIcons: Boolean,
    inputLabel: String,
    onSelect: Function,
    resourceTypes: Array,
});

const emit = defineEmits(["close", "select"]);

const searchInput = ref(null);
const results = ref(null);

const search = () => {
    if (!searchInput.value?.length) {
        results.value = null;
        return;
    }
    useSearch();
};

const loading = ref(false)

const useSearch = useThrottleFn(async () => {
    loading.value = true;
    const formatted = searchInput.value
        .split(" ")
        .map((val) => `${val}`)
        .join(" | ");
    const client = useSupabaseClient();

    // if (global.value) {
    const { data } = await client
        .rpc("search_resources", {
            searchquery: formatted,
        })
        .limit(25);

    results.value = data.reduce((all, current) => {
        if (current.resourcetype === 'profile') return all;
        if (!props.resourceTypes?.length) return [...all, current];
        if (!props.resourceTypes.includes(current.resourcetype)) return all;
        return [...all, current];
    }, []);
    loading.value = false;
    // const { data } = await client
    //     .from(props.tableName)
    //     .select(`teams (
    //         id,
    //         name
    //     ),
    //     rinks (
    //         id,
    //         name
    //     )`)
    //     .textSearch('rinks.name', formatted)
    //     .textSearch('teams.name', formatted)

    //     .order('name', {ascending: true})
    // results.value = data.map((d) => ({
    //     ...d,
    //     username: d.username?.username,
    // }));
    // } else {
    //   const { user: userId } = useUser();
    //  const {data} = await client.rpc('search_resources', {searchquery: formatted}).eq('profile_id', userId.value)
    // console.log('data: ', data)

    // const { data } = await client
    //     .from(props.tableName)
    //     .select(props.query)
    //     .textSearch(props.queryField, formatted)
    //     .eq("profile_id", userId.value)
    //     .order(props.queryField, {ascending: true})
    // results.value = data.map((d) => ({
    //     ...d,
    //     username: d.username?.username,
    // }));
    // }
}, 100);

// const global = ref(false);

// const toggleGlobal = () => {
//     if (props.globalOnly) return;
//     global.value = !global.value;
// };

// const toggleSearch = () => {
//     if (!props.globalOnly) global.value = false;
// };

const clickable = ref(true);

const onFocus = ({ type }) => {
    nextTick(() => {
        if (type === "focusin") {
            clickable.value = false;
        } else {
            clickable.value = true;
        }
    });
};

// onMounted(() => {
//     if (props.globalOnly) {
//         global.value = true;
//     }
// });

const clearResults = () => {
    results.value = null;
};

const searchBar = ref(null);
const { height: searchBarHeight, y: searchBarY } =
    useElementBounding(searchBar);
</script>
