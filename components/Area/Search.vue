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
                        @click="emit('close')"
                        v-if="!hideIcons"
                        color="white"
                    />
                </template>
            </q-input>
        </div>
        <!-- :style="{height: `calc(100% - ${searchBarHeight}px)`}" -->
        <transition appear name="expand-shrink" mode="out-in">
            <div
                class="search-results__container z-top"
                :style="{
                    top: `${searchBarY}px + ${searchBarHeight}px`,
                    maxHeight: `calc(100 * var(--vh, 1vh) - (${searchBarY}px + ${searchBarHeight}px + 32px))`,
                }"
                v-if="results"
            >
                <div
                    v-if="!results?.length"
                    class="result__container no-grid row justify-center"
                >
                    No results.
                </div>
                <div
                    v-for="result in results"
                    :key="result.id"
                    @click="emit('select', {result, event: $event})"
                >
                    <div class="result__container">
                        <!-- RINK result -->
                        <div
                            v-if="result.resourcetype === 'rink'"
                            class="icon__wrap"
                        >
                            <div
                                class="row justify-center items-center icon__container"
                            >
                                <q-icon
                                    size="2em"
                                    name="location_on"
                                    color="red"
                                />
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
                        <div v-if="result.resourcetype === 'rink'">
                            <slot name="append" v-bind:result="result" />
                        </div>

                        <!-- TEAM result -->
                        <div v-if="result.resourcetype === 'team'">
                            <TeamAvatar :teamId="result.id" />
                        </div>
                        <div
                            v-if="result.resourcetype === 'team'"
                            class="column justify-center"
                        >
                            <div class="text-sm">Team</div>
                            <div class="text-bold">{{ result.name }}</div>
                        </div>
                        <div v-if="result.resourcetype === 'team'">
                            <slot name="append" v-bind:result="result" />
                        </div>
                        <!-- EVENT result -->
                        <div
                            v-if="result.resourcetype === 'event'"
                            class="icon__wrap"
                        >
                            <div
                                class="row justify-center items-center icon__container"
                            >
                                <q-icon
                                    size="2em"
                                    name="emoji_events"
                                    color="yellow"
                                />
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
                        <div v-if="result.resourcetype === 'event'">
                            <slot name="append" v-bind:result="result" />
                        </div>
                        <!-- USER result -->

                        <div v-if="result.resourcetype === 'profile'">
                            <Avataaar v-bind="parseAvatar(result.avatar)" />
                        </div>
                        <div class="column justify-center"  v-if="result.resourcetype === 'profile'">
                            <div class="text-sm">User</div>
                            <div class="text-bold">{{ result.name }}</div>
                        </div>
                        <div v-if="result.resourcetype === 'profile'">
                            <slot name="append" v-bind:result="result" />
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
    <!-- </Teleport> -->
</template>
<style lang="scss" scoped>
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

        overflow: auto;
        margin: 0px var(--space-md);
        border-radius: 16px;
        .result__container {
            background-color: rgba(255, 255, 255, 0.8);
            padding: var(--space-sm);

            > div:nth-child(2) {
                margin-left: 16px;
            }
            &:not(.no-grid) {
                display: grid;
                grid-template-columns: 50px 1fr auto;
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
import { useElementBounding, useThrottleFn, onClickOutside } from "@vueuse/core";
import { parseAvatar } from "@/utils/avatar";

const props = defineProps({
    restrictIds: {
        type: Array,
        default: []
    },
    filterIds: {
        type: Array,
        default: [],
    },
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
            props.filterIds.length && 
            (props.filterIds.includes(current.id) ||
            props.filterIds.includes(current.profile_id))
        )
            return all;
        
        if (props.restrictIds?.length && (!props.restrictIds.includes(current.id) && !props.restrictIds.includes(current.profile_id))) return all;
        return [...all, current];
    }, []);
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


</script>
<script>
export default {
    name: "AreaSearch",
};
</script>
