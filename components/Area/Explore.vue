<template>
    <header class="outer-header__container" ref="header">
        <div class="team__content--container" >
        <div class="team-header__container" ref="swipe">
            <div class="row justify-between no-wrap">
                <!-- <q-btn flat dense icon="chevron_left" size="" color="grey-6" @click="goNext(-1)" /> -->

                <div
                    style="
                        max-width: min(400px, 90vw);
                        transition: opacity 0.3s;
                    "
                    class="col-grow"
                    :style="{ opacity: showSearch ? '0' : '1' }"
                    ref="avatarHeader"
                >
                <!-- :onClick="expandTeam" -->
                    <ProfileCard :avatar="team?.team_avatar" type="team" animated viewable :item="team" >
                        <template v-slot:overline>
                            Team
                        </template> 
                         <span class="text-bold">{{team?.name}}</span>
                         <template v-slot:subtitle>
                            <div class="badge__container">
                              <Badge badge="showoff"  :raw="5" height="2em" />
            <Badge badge="bandit"  :raw="6" height="2em" />
            </div>
                         </template>    
                      
                    </ProfileCard>
                </div>
                <div v-if="showSearch" class="search__container--floating">
                    <q-input
                        rounded
                        outlined
                        label="Search for a team"
                        color="deep-purple"
                        :hint="global ? 'Searching worldwide' : ''"
                        hide-hint
                        ref="inputRef"
                        v-model="searchInput"
                        @keydown.enter="search"
                        @focus="onFocus"
                        @blur="onFocus"
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
                    </q-input>
                </div>
                <div class="row justify-center items-center q-mr-md">
                    <q-btn
                        flat
                        round
                        icon="search"
                        color="grey-8"
                        @click="toggleSearch"
                    />
                </div>
                <!-- <q-btn flat dense icon="chevron_right" size="" color="grey-6" @click="goNext(1)" /> -->
            </div>
        </div>
        <transition appear enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
         <div v-if="showTeam">Team details</div>
        </transition>
        </div>
              
        <nav>
            <q-tabs dense v-model="tab" stretch active-color="deep-purple" v-if="!showSearch">
                <q-tab name="stats" label="Stats" style="width: 50%" />
                <q-tab name="history" label="History" style="width: 50%" />
            </q-tabs>
         
        </nav>
 
    </header>
  
    <main class="column select__section full-width no-wrap">
      

        <!-- <transition
            appear
            enter-active-class="animated slideInLeft"
            leave-active-class="animated slideOutRight"
        > -->
           
                <TeamStatsView
                    :teamId="team?.id"
                    v-if="!showSearch && tab === 'stats'"
                    key="stats"
                />
                    <TeamGameHistory
                :teamId="team?.id"
                :team="team"
                  key="gamehistory"
             
                v-else-if="!showSearch && tab === 'history'"
            />

                <TeamList
                 v-else-if="!results"
                    :teams="teams"
                    @select="onSelect"
                  
                    key="myteams"
                />
                
               
                <TeamList
                v-else
                    :teams="results"
                    @select="onSelectGlobal"
                    key="globalteams"
               />
          
        <!-- </transition> -->
    
    </main>
</template>
<style lang="scss" scoped>
.badge__container {
    display: flex;
    height: 2em;
    margin-top: calc(-1 * var(--space-xs));
}
.search__container--floating {
    position: absolute;
    width: calc(100vw);
    padding-right: 4em;
    padding-left: var(--space-xs);
    left: 0;
    right: 0;
    height: fit-content;
    top: 0;
    bottom: 0;
    margin: auto;

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
.select__section {
    height: v-bind(mainHeight);
    overflow: auto;
}
.outer-header__container {
    box-shadow: $pretty-shadow;
    // border-bottom-left-radius: 16px;
    // border-bottom-right-radius: 16px;
}
.team__content--container {
        border-bottom: 1px solid $grey-4;
.team-header__container {
    // border-radius: inherit;
    padding: var(--space-xs);

    position: sticky;
    top: 0;
    background-color: rgba(255, 255, 255, 0.98);
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
import { useElementSize, useFocus, useSwipe, useThrottleFn} from "@vueuse/core";
import { TABLE_QUERIES } from "@/constants/query";
const tab = ref("stats");
import { useTeamStore } from "@/store/teams";
const store = useTeamStore();

const teams = computed(() => store.teams);

const teamIndex = ref(null);
const resultIndex = ref(null);

const team = computed(() => {
    if (teamIndex.value !== null) return teams.value[teamIndex.value]
    if (resultIndex.value !== null && results.value) return results.value[resultIndex.value];
    return null
});

const onSelect = (index) => {
    if (!clickable.value) return;
    teamIndex.value = index;
    resultIndex.value = null
    showSearch.value = false;
};
const onSelectGlobal = (index) => {
    if (!clickable.value) return;
    resultIndex.value = index;
    teamIndex.value = null;
    showSearch.value = false;
}

const index = ref(0);

const swipe = ref(null);

const showSearch = ref(true);

const inputRef = ref(null);

const toggleGlobal = () => {
    global.value = !global.value;
    if (global.value) inputRef.value.focus();
};

const clickable = ref(true)

const onFocus = ({type}) => {
    nextTick(() => {
        if (type === 'focusin') {
            clickable.value = false;
        } else {
            clickable.value = true;
        }
    })
    console.log('focused: ', val)
}


const global = ref(false);

const goNext = (inc) => {
    if (index.value + inc > teams.value.length || index.value + inc < 0) return;
    index.value += inc;
};
const { direction } = useSwipe(swipe, {
    onSwipe: useThrottleFn(() => {
        if (direction.value === "left") {
            goNext(+1);
        } else {
            goNext(-1);
        }
    }, 300),
    threshold: 100,
});

const header = ref(null);
const { height: headerHeight } = useElementSize(header);

const mainHeight = computed(() => `calc(100% - ${headerHeight.value}px)`)

const avatarHeader = ref(null);
const { height: avatarHeight } = useElementSize(avatarHeader);

/**
 * BEGIN SEARCH
 */
const toggleSearch = useThrottleFn(() => {
    if (!team.value) return;
    showSearch.value = !showSearch.value;
}, 500);

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

/**
 * END SEARCH
 */

/**
 * View team details
 */

const showTeam = ref(false)

const expandTeam = () => {
    showTeam.value = !showTeam.value
}
</script>
