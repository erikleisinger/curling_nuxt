<template>
    <div
        class="full-height no-wrap"
        :class="{ column: !oppositionTeam, row: !!oppositionTeam }"
    >
        <div
            class="col-12 col-sm-6 row full-width view-more__container"
            v-show="!!viewDetails?.length"
        >
            <ChartTeamStatsTime
                :teamId="team.id"
                v-if="!oppositionTeam && !!viewDetails.length"
                :visibleStats="viewDetails"
                @close="viewDetails = []"
            />
        </div>

        <div
            class="stats__container column no-wrap"
            v-if="
                ($q.screen.gt.xs || !viewDetails?.length)
            "
            :class="{
                'col-12': $q.screen.xs || !viewDetails.length,
                'col-6': viewDetails.length && !$q.screen.xs,
            }"
        >
            <div
                class="column no-wrap"
                v-for="(badge, index) in fields"
                :key="`percentage-${badge}`"
            >
                <div
                    v-if="!!oppositionTeam"
                    class="q-mt-md row no-wrap"
                >
                    <div class="row col-grow justify-start items-center">
                        <div class="team-avatar__container">
                            <TeamAvatar
                                :team="team"
                                :color="showColors ? team.color : null"
                                        :viewable="!!team.id"
                               
                            />
                           
                        </div>
                    </div>
                    <div>
                        <h2 class="text-md q-mr-md  text-center">
                            {{ BADGE_TITLES_PLAIN[badge] }}
                        </h2>
                        <h3 class="text-sm text-center">
                            {{ BADGE_DESCRIPTIONS_PLAIN[badge] }}
                        </h3>
                    </div>
                    <div class="row col-grow justify-end items-center">
                        <div class="team-avatar__container">
                            <TeamAvatar
                                :team="oppositionTeam"
                                :color="showColors ? oppositionTeam.color : null"
                                :viewable="!!oppositionTeam.id"
                                
                            />
                          
                        </div>
                    </div>
                </div>

                <div class="row no-wrap">
                    <div
                        :class="
                            !!oppositionTeam
                                ? 'col-6 q-pr-md'
                                : 'col-12'
                        "
                        v-if="!reloading"
                    >
                        <LazyTeamStatsViewPercentage
                            class="full-width"
                            :badge="badge"
                            :teamId="Number.parseInt(team.id)"
                            :numerator="team[BADGE_FIELDS[badge].numerator]"
                            :denominator="team[BADGE_FIELDS[badge].denominator]"
                            @showMore="viewMore(BADGE_TITLES_PLAIN[badge])"
                            :visible="
                                viewDetails.includes(BADGE_TITLES_PLAIN[badge])
                            "
                            :dense="!!oppositionTeam"
                            :prependPercent="
                                !!oppositionTeam
                            "
                        />
                    </div>
                    <div
                        class="col-6 q-pl-md"
                        v-if="!reloading && oppositionTeam"
                    >
                        <LazyTeamStatsViewPercentage
                            class="full-width"
                            :badge="badge"
                            :teamId="Number.parseInt(oppositionTeam.id)"
                            :numerator="
                                oppositionTeam[BADGE_FIELDS[badge].numerator]
                            "
                            :denominator="
                                oppositionTeam[BADGE_FIELDS[badge].denominator]
                            "
                            @showMore="viewMore(BADGE_TITLES_PLAIN[badge])"
                            :visible="
                                viewDetails.includes(BADGE_TITLES_PLAIN[badge])
                            "
                            dense
                            reverse
                        />
                    </div>
                </div>
                <q-separator v-if="index !== fields.length - 1"/>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.team-avatar__container {
    height: 3em;
    width: 3em;
}
.stats__container--pie {
    padding: var(--space-md) 0px;
    border-bottom: 1px solid $grey-4;
}
.stats__container {
    padding: 0px var(--space-md);
    border-radius: 8px;
    .toolbar {
        padding: var(--space-sm);
    }
}
.view-more__container {
    overflow: auto;
    position: relative;
    height: v-bind(viewerHeight);
    .view-details-back__container {
        position: absolute;
        padding: var(--space-xs);
        right: 0;
    }
    @include sm {
        border-top: 1px solid $grey-5;
    }
}
</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import {
    BADGE_FIELDS,
    BADGE_THRESHOLDS,
    BADGE_TITLES_PLAIN,
    BADGE_DESCRIPTIONS_PLAIN,
} from "@/constants/badges";

const props = defineProps({
    exclude: {
        type: Array,
        default: []
    },
    team: Object,
    oppositionTeam: Object,
    // Requires 'color' to be included in team/oppositionTeam props
    showColors: Boolean,
    teamId: Number,
    teamName: {
        type: String,
        default: "<TEAM>",
    },
    viewerHeight: String,
});

const EXCLUDE_FIELDS = ["survivalist", ...props.exclude];
const fields = Object.keys(BADGE_FIELDS).filter(
    (f) => !EXCLUDE_FIELDS.includes(f)
);

const $q = useQuasar();

const viewDetails = ref([]);
const detailsType = ref(null);

const viewMore = (str) => {
    if (viewDetails.value.includes(str)) {
        const index = viewDetails.value.indexOf(str);
        viewDetails.value.splice(index, 1);
    } else {
        viewDetails.value.push(str);
    }
};



const reloading = ref(false)

watch(() => props.team || props.oppositionTeam, () => {
    reloading.value = true;
    nextTick(() => {
        reloading.value = false;
    })
})

</script>
