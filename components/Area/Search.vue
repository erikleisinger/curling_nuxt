<template>
    <Teleport to="body">
        <div class="search-container--floating z-top">
            <div class="search__container--floating" ref="searchBar" >
                <q-input
                    rounded
                    outlined
                    :label="inputLabel"
                    color="deep-purple"
                    :hint="global ? 'Searching worldwide' : ''"
                    v-model="searchInput"
                    @keydown.enter="search"
                    clearable
                    @clear="clearResults"
                >
                    <template v-slot:before>
                        <q-btn
                            flat
                            icon="public"
                            dense
                            round
                            :color="global ? 'deep-purple' : ''"
                            class="q-px-none q-mr-none"
                            size="lg"
                            @click.prevent="toggleGlobal"
                        />
                    </template>
                    <template v-slot:after>
                        <q-btn
                            flat
                            round
                            icon="search"
                            @click="emit('close')"
                        />
                    </template>
                </q-input>
            </div>
            <div :style="{height: `calc(100% - ${searchBarHeight}px)`}">
                <slot :results="results" />
            </div>
        </div>
    </Teleport>
</template>
<style lang="scss" scoped>
.search-container--floating {
    position: absolute;
    left: 0;
    right: 0;
    height: calc(100 * var(--vh, 1vh));
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: white;
    .search__container--floating {
        width: calc(100vw);
        padding-right: var(--space-xs);
        padding-left: var(--space-xs);
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
import { useTeamStore } from "@/store/teams";
import { useElementBounding, useThrottleFn } from "@vueuse/core";

const props = defineProps({
    globalOnly: Boolean,
    inputLabel: String,
    onSelect: Function,
    query: String,
    queryField: {
        type: String,
        default: 'name'
    },
    tableName: String,
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

const useSearch = useThrottleFn(async () => {
    const formatted = searchInput.value
        .split(" ")
        .map((val) => `${val}:*`)
        .join(" | ");
    const client = useSupabaseClient();

    if (global.value) {
        const { data } = await client
            .from(props.tableName)
            .select(props.query)
            .textSearch(props.queryField, formatted);
        results.value = data.map((d) => ({
            ...d,
            username: d.username?.username,
        }));
    } else {
        const { user: userId } = useUser();
        const { data } = await client
            .from(props.tableName)
            .select(props.query)
            .textSearch(props.queryField, formatted)
            .eq("profile_id", userId.value);
        results.value = data.map((d) => ({
            ...d,
            username: d.username?.username,
        }));
    }
}, 5000);

const global = ref(false);

const toggleGlobal = () => {
    if (props.globalOnly) return;
    global.value = !global.value;
};

const toggleSearch = () => {
    if (!props.globalOnly) global.value = false;
};

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

const store = useTeamStore();

const teams = computed(() => store.teams);

const teamIndex = ref(null);
const resultIndex = ref(null);

const handleSelect = (i) => {
    if (global.value) {
        emit("select", results.value[i]);
    } else {
        emit("select", teams.value[i]);
    }
};

onMounted(() => {
    if (props.globalOnly) {
        global.value = true;
    }
});

const clearResults = () => {
    results.value = null;
};

const searchBar = ref(null);
const {height: searchBarHeight} = useElementBounding(searchBar)
</script>
