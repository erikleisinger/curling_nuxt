<template>
    <div class="team-page-container">

       
        <TeamPageHeader2
            :teamId="teamId"
            @loaded="headerLoaded = true"
            ref="header"
            :create="isCreate"
        />
     

        <q-tabs
            v-if="!isCreate && $q.screen.xs"
            class="team-page__tabs"
            ref="tabs"
            v-model="currentIndex"
            outside-arrows
            shrink
        >
            <q-tab label="Players" :name="0" :ripple="false" />

            <q-tab label="History" :name="1" :ripple="false" />
        </q-tabs>

        <div class="row q-mt-lg full-width" v-if="!isCreate">
            <div
                v-if="!isCreate && !$q.screen.xs || currentIndex === 0"
                :class="$q.screen.xs ? 'col-12' : 'col-6'"
            >
                <h2 v-if="!$q.screen.xs" class="text-center md-text q-pb-lg">
                    Info
                </h2>
                <div  class="player-section">
                   
                    <RinkCard :rink="team?.rink" v-if="!$q.screen.xs" class="q-mb-lg"/>
                    
                    <TeamPageRequestsHandler :teamId="teamId" class="team-requests__floating" id="team-page-requests-handler" :class="{ 'float-page-top': !!helpRequest}" v-if="helpRequest || isOnTeam(teamId)"/>
                    <div class="row full-width justify-center">
                    <TeamPagePlayers :teamId="teamId" />
                    </div>
                   
                </div>
            </div>
            <div
                v-if="!isCreate && !$q.screen.xs || currentIndex === 1"
                :class="$q.screen.xs ? 'col-12' : 'col-6'"
                style="min-height: 300px"
            >
                <h2 v-if="!$q.screen.xs" class="text-center md-text q-pb-lg">
                    Game history
                </h2>
                <GameResultList :teamId="teamId" />
            </div>
        </div>
        <div v-else style="height: 500px"/>
    </div>
</template>
<style lang="scss" scoped>

.team-page-container {
    // @include $bg-blue-side;
    position: relative;
    @include lines;
    height: 100%;
}

.player-section {
    width: fit-content; 
    margin: auto; 
    position: relative;
    margin-bottom: var(--space-md)
}

.team-requests__floating {
    position: absolute;
    z-index: 3;
    margin: auto;
    left: 0;
    right: 0;
    top:0;
    width: fit-content;

    &.float-page-top {
        position: fixed;
        top: calc($app-header-height-xs + var(--space-sm));
        z-index: 1;
        bottom: unset;
        @include sm {
            top: calc($app-header-height-sm + var(--space-sm));
        }
    }
}


.team-page__tabs {

   @include tabs($app-mint)

}
.stats {
    margin-left: -16px;
    margin-right: -16px;
    margin-top: calc(-1 * var(--space-lg));
}




</style>
<script setup lang="ts">
import Team from "@/store/models/team";

const { toTimezone } = useTime();

const viewing = ref(false);

const $q = useQuasar();

const route = useRoute();

const teamId = Number(route.params.id);

const isCreate = computed(() => Number.isNaN(teamId))

const team = computed(() =>
    useRepo(Team).withAllRecursive().where("id", teamId).first()
);

const { isOnTeam } = useTeam();
const canEdit = computed(() => isOnTeam(teamId));

const currentIndex = ref(0);
const changeTab = (newTab) => {
    currentIndex.value = newTab;
};

const headerLoaded = ref(false);

const { setLoading } = useLoading();

const pageReady = computed(() => headerLoaded.value);

watch(pageReady, (val) => {
    if (!val) return;
    setTimeout(() => {
        setLoading(false);
    }, 50);
});

const helpRequest = computed(() => !!route?.query?.request)
</script>
<script lang="ts">
export default {
    name: "TeamPage",
};
</script>
