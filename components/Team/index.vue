<template>

<header ref="header">
        <div class="team__content--container">
            <div class="team-header__container" >
                <div class="row justify-between no-wrap">
                    <div
                        style="
                            max-width: min(400px, 90vw);
                            transition: opacity 0.3s;
                        "
                        class="col-grow"
                    >
                        <ProfileCard
                            :avatar="team?.team_avatar"
                            type="team"
                            animated
                            viewable
                            :item="team"
                        >
                            <template v-slot:overline> Team </template>
                            <span class="text-bold">{{ team?.name }}</span>
                            <template v-slot:subtitle>
                                <ProfileBadges :teamId="team?.id" />
                            </template>
                        </ProfileCard>
                    </div>

                    <div class="row justify-center items-center q-mr-md">
                        <slot name="appendButton"/>
                    </div>
                   
                </div>
            </div>
        </div>

        <nav>
            <q-tabs
                dense
                v-model="tab"
                stretch
                active-color="deep-purple"
       
            >
                <q-tab name="stats" label="Stats" style="width: 50%" />
                <q-tab name="history" label="History" style="width: 50%" />
            </q-tabs>
        </nav>
        </header>

    <main class="column select__section full-width no-wrap" >
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
.team__content--container {
    border-bottom: 1px solid $grey-4;
    .team-header__container {
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
import { useElementSize } from "@vueuse/core";


const props = defineProps({
    team: Object,
})

const tab = ref("stats");

const index = ref(0);


const header = ref(null);
const { height: headerHeight } = useElementSize(header);

const mainHeight = computed(() => `calc(100% - ${headerHeight.value}px)`);

</script>