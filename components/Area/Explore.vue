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
                    
                              <ProfileBadges :teamId="team?.id"  />
       

                         </template>    
                      
                    </ProfileCard>
                </div>
                <!-- <div v-if="showSearch" class="search__container--floating">
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
                </div> -->
                 <div class="row justify-center items-center q-mr-md">
                    <q-btn
                        flat
                        round
                        icon="search"
                        color="grey-8"
                        @click="showSearch = true"
                    />
                </div>
                <AreaSearch @select="onSelect" v-if="showSearch" @close="showSearch = false" />
               
                <!-- <q-btn flat dense icon="chevron_right" size="" color="grey-6" @click="goNext(1)" /> -->
            </div>
        </div>
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
                    v-if="team && tab === 'stats'"
                    key="stats"
                />
                    <TeamGameHistory
                :teamId="team?.id"
                :team="team"
                  key="gamehistory"
             
                v-else-if="team && tab === 'history'"
            />

                <!-- <TeamList
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
               /> -->
          
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
import { useElementSize, useThrottleFn} from "@vueuse/core";
import { TABLE_QUERIES } from "@/constants/query";
const tab = ref("stats");
import { useTeamStore } from "@/store/teams";
const store = useTeamStore();

const teams = computed(() => store.teams);


const team = ref(null)

const onSelect = (selectedTeam) => {
    team.value = selectedTeam
    showSearch.value = false;
};


const index = ref(0);

const swipe = ref(null);

const showSearch = ref(false);

const inputRef = ref(null);


const clickable = ref(true)



const global = ref(false);


const header = ref(null);
const { height: headerHeight } = useElementSize(header);

const mainHeight = computed(() => `calc(100% - ${headerHeight.value}px)`)

const avatarHeader = ref(null);
const { height: avatarHeight } = useElementSize(avatarHeader);

</script>
