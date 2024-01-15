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
                bg-color="white"
                autofocus
                ref="input"
            >
                <!-- :hint="global && !hideHint ? 'Searching worldwide' : ''" -->
                <template v-slot:before v-if="!hideIcons">
                    <slot name="before" />
                </template>
                <template v-slot:after>
                    <q-btn
                        flat
                        round
                        icon="search"
                        @click="search"
                        v-if="!hideIcons"
                        color="white"
                    />
                </template>
            </q-input>
        </div>
        <!-- :style="{height: `calc(100% - ${searchBarHeight}px)`}" -->
        <transition appear name="expand-shrink" mode="out-in">
            <q-list
                class="search-results__container z-top"
                :style="{
                    top: `${searchBarY}px + ${searchBarHeight}px`,
                    maxHeight: `calc(100 * var(--vh, 1vh) - (${searchBarY}px + ${searchBarHeight}px + 32px))`,
                }"
                v-if="results"
                separator
            >
                <div
                    v-if="!results?.length"
                    class="no-result__container no-grid row justify-center"
                >
                    No results.
                </div>
                <q-item
                    v-for="result in results"
                    :key="result.id"
                    @click="onClick(result, $event)"
                    clickable
                    v-ripple

                >

                <!-- Avatar -->

                    <q-item-section avatar>
                        <q-icon
                            v-if="result.resourcetype === 'rink'"
                            size="2em"
                            name="location_on"
                            color="red"
                        />
                        <div v-else-if="result.resourcetype === 'team'" style="width: 40px">
                            <TeamAvatar :teamId="result.id" />
                        </div>

                         <q-icon
                         v-else-if="result.resourcetype === 'event'"
                                    size="2em"
                                    name="emoji_events"
                                    color="yellow"
                                />

                                <div v-else-if="result.resourcetype === 'profile'" style="width: 40px">
                            <Avataaar v-bind="parseAvatar(result.avatar)" />
                        </div>
                         <q-icon  v-else-if="result.resourcetype === 'league'" name="table_view" size="2em" :style="{color: result.color}"/>

                    </q-item-section>

                    <!-- Content --> 

                    <q-item-section v-if="result.resourcetype === 'rink'">
                        
                        <q-item-label class="text-bold">{{ result.name }}</q-item-label>
                        <q-item-label caption> {{ `${result.city}, ${result.province}` }}</q-item-label>
             <q-item-label v-if="filterIdMsg && isDisabled(result)" class="text-caption text-red">{{filterIdMsg(result)}}</q-item-label>
                    </q-item-section>

                      <q-item-section v-if="result.resourcetype === 'team'">
    
                        <q-item-label class="text-bold">{{ result.name }}</q-item-label>
                        <q-item-label caption> {{ result.rink_name }}</q-item-label>
                  <q-item-label v-if="filterIdMsg && isDisabled(result)" class="text-caption text-red">{{filterIdMsg(result)}}</q-item-label>
                    </q-item-section>

                         <q-item-section v-if="result.resourcetype === 'event'">
                        <q-item-label class="text-bold">{{ result.name }}</q-item-label>
                        <q-item-label caption> {{ result.loc }}</q-item-label>
                     <q-item-label v-if="filterIdMsg && isDisabled(result)" class="text-caption text-red">{{filterIdMsg(result)}}</q-item-label>
                    </q-item-section>

                          <q-item-section v-if="result.resourcetype === 'profile'">
                        <q-item-label class="text-bold"> {{ result.first_name }} {{ result.last_name }}</q-item-label>
                        <q-item-label caption>   @{{ result.name }}</q-item-label>
                         <q-item-label v-if="filterIdMsg && isDisabled(result)" class="text-caption text-red">{{filterIdMsg(result)}}</q-item-label>
                    </q-item-section>

                         <q-item-section v-if="result.resourcetype === 'league'">
                        <q-item-label class="text-bold"  :style="{color: result.color}"> {{ result.name }} </q-item-label>
                        <q-item-label caption>   @{{ result.rink_name }}</q-item-label>
                      <q-item-label v-if="filterIdMsg && isDisabled(result)" class="text-caption text-red">{{filterIdMsg(result)}}</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                        <q-item-label caption>
                            {{formattedType(result.resourcetype)}}
                        </q-item-label>
                    </q-item-section>
                   
                </q-item>
            </q-list>
        </transition>
    </div>
    <!-- </Teleport> -->
</template>
<style lang="scss" scoped>
@include styleInput($app-mint, 'white');
.expand-shrink-enter-active,
.expand-shrink-leave-active {
    transition: all 0.3s;
    transform-origin: top;
}

.expand-shrink-enter-from {
    transform-origin: top;
    transform: scaleY(0);
}
.expand-shrink-enter-to {
    transform: scaleY(1);
}

.expand-shrink-enter,
.expand-shrink-leave-to {
    transform-origin: top;
    transform: scaleY(0);
}

.search-container--floating {
    width: 100%;
    position: relative;
    .search-results__container {
        position: absolute;
        width: calc(100% - var(--space-md) * 2);
        background-color: white;
        overflow: auto;
        margin: 0px var(--space-md);
        padding: var(--space-xxxs) 0px;
        border-radius: 16px;
        
        .q-item__label--overline {
            text-transform: uppercase;
        }
        .no-result__container {
            padding: var(--space-md);
            font-weight: bold;
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
    .name {
        line-height: 1.2em;
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
import {
    useElementBounding,
    useThrottleFn,
    onClickOutside,
} from "@vueuse/core";
import { parseAvatar } from "@/utils/avatar";

const props = defineProps({
    restrictIds: {
        type: Array,
        default: [],
    },
    filterIds: {
        type: Array,
        default: [],
    },
    filterIdMsg: Function,
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
const input = ref(null);

const search = () => {
    if (!searchInput.value?.length) {
        results.value = null;
        return;
    }

    useSearch();
};

const loading = ref(false);

const useSearch = useThrottleFn(async () => {
    loading.value = true;
    const formatted = searchInput.value
        .split(" ")
        .map((val) => `${val}`)
        .join(" | ");
    const client = useSupabaseClient();

    const { data } = await client
        .rpc("search_resources", {
            searchquery: formatted,
        })
        .limit(25);

    results.value = data.reduce((all, current) => {
        if (!props.resourceTypes?.length) return [...all, current];
        if (!props.resourceTypes.includes(current.resourcetype)) return all;
        if (
            !props.filterIdMsg && 
            props.filterIds.length &&
            (props.filterIds.includes(current.id) ||
                (current.resourcetype === "profile" &&
                    props.filterIds.includes(current.profile_id)))
        )
            return all;

        if (
            props.restrictIds?.length &&
            !props.restrictIds.includes(current.id) &&
            !props.restrictIds.includes(current.profile_id)
        )
            return all;
        return [...all, current];
    }, []);

    if (!!results.value?.length) input.value.blur();
    loading.value = false;
}, 100);

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

const clearResults = () => {
    results.value = null;
};

const searchBar = ref(null);
const { height: searchBarHeight, y: searchBarY } =
    useElementBounding(searchBar);


    const formattedType = (type) => {
        return {
            rink: 'Rink',
            team: 'Team',
            profile: 'Player',
            league: 'League',
            event: 'Event',
        }[type]
    }

    const onClick = (result, event) => {
        if (props.filterIds.includes(result.id) || props.filterIds.includes(result.profile_id) || props.filterIds.includes(result.team_id)) return;
        emit('select', { result, event })
    }

    const isDisabled = (result) => {
        return props.filterIds.includes(result.id) || props.filterIds.includes(result.profile_id) || props.filterIds.includes(result.team_id)
    }
</script>
<script>
export default {
    name: "AreaSearch",
};
</script>
