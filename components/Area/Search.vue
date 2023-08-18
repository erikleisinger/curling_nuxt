<template>
    
    <Teleport to="body">
        <div class="search-container--floating  z-top" >
            <div class="search__container--floating" >
                <q-input
                    rounded
                    outlined
                    label="Search for a team"
                    color="deep-purple"
                    :hint="global ? 'Searching worldwide' : ''"
                    v-model="searchInput"
                    @keydown.enter="search"
                    clearable
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
    <q-btn flat round icon="search" @click="emit('close')"/>
                    </template>
                </q-input>
            

                <!-- <TeamList
                v-else
                    :teams="results"
                    @select="onSelectGlobal"
                    key="globalteams"
               /> -->
            </div>
            <div >
                 <TeamList
                 v-if="!global"
                    :teams="teams"
                    @select="handleSelect"
                  
                    key="myteams"
                />
                
               
                <TeamList
                v-else
                    :teams="results"
                    @select="handleSelect"
                    key="globalteams"
               />
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
    background-color:white;
    .search__container--floating {
        width: calc(100vw);
           padding-right: var(--space-xs);
        padding-left: var(--space-xs);
        margin-top: var(--space-md);
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
import {useThrottleFn} from '@vueuse/core'

const props = defineProps({
    globalOnly: Boolean,
    onSelect: Function,
});

const emit = defineEmits(['close', 'select'])

const searchVisible = ref(false);

const searchInput = ref(null);
const results = ref(null);

const search = () => {
    if (!searchInput.value?.length) {
        results.value = null;
        return;
    }
    useSearch();
};

const query = `
    id,
    name,
    team_avatar,
    profile_id,
    username:profile_id (username)
`

const useSearch = useThrottleFn(async () => {
    const formatted = searchInput.value
        .split(" ")
        .map((val) => `${val}:*`)
        .join(" | ");
    const client = useSupabaseClient();

    if (global.value) {
        const { data } = await client
            .from("teams")
            .select(query)
            .textSearch("name", formatted);
        results.value = data.map((d) => ({...d, username: d.username?.username}));
    } else {
        const { user: userId } = useUser();
        const { data } = await client
            .from("teams")
            .select(query)
            .textSearch("name", formatted)
            .eq("profile_id", userId.value);
        results.value = data.map((d) => ({...d, username: d.username?.username}));
    }
}, 5000);

const global = ref(false);

const toggleGlobal = () => {
    if (props.globalOnly) return;
    global.value = !global.value;
};

const toggleSearch = () => {
    searchVisible.value = !searchVisible.value;
    if (!props.globalOnly) global.value = false;
}

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
        emit('select', results.value[i])
    } else {
 emit('select', teams.value[i])
    }
    searchVisible.value = false;
   
}

onMounted(() => {
    if (props.globalOnly) {
        global.value = true;
    }
})
</script>
