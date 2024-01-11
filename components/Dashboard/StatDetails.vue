<template>
    <div class="details__container">
       
        <div   v-if="shouldShowHammerStats">
        <div
            class="row__container row justify-between"
          
        >
            <h4>With hammer in first end</h4>
            <h5>{{ cleanNumber(withHammerFe) }}</h5>
        </div>
          <div
            class="row__container row justify-between"
           
        >
            <h4>Without hammer in first end</h4>
            <h5>{{ cleanNumber(withoutHammerFe) }}{{}}</h5>
        </div>
        <div
            class="row__container row justify-between"
         
        >
            <h4>With hammer in last end</h4>
            <h5>{{ cleanNumber(withHammerLe) }}{{}}</h5>
        </div>
      

            <div
            class="row__container row justify-between"
          
        >
            <h4>Without hammer in last end</h4>
            <h5>{{ cleanNumber(withoutHammerLe) }}{{}}</h5>
        </div>

         <q-separator class="separator" />
        </div>

        <div class="row__container row justify-between">
            <h4>
                <q-icon
                    name="circle"
                    size="0.7em"
                    :style="{ color: getColor('red') }"
                    class="q-mr-xs"
                />Red rocks
            </h4>
            <h5>
                <span class="plus-minus__text"> </span>
                {{ cleanNumber(withRed) }}
            </h5>
        </div>
        <div class="row__container row justify-between">
            <h4>
                <q-icon
                    name="circle"
                    size="0.7em"
                    :style="{ color: getColor('yellow') }"
                    class="q-mr-xs"
                />Yellow rocks
            </h4>
            <h5>{{ cleanNumber(withYellow) }}</h5>
        </div>
        <div class="row__container row justify-between">
            <h4>
                <q-icon
                    name="circle"
                    size="0.7em"
                    :style="{ color: getColor('blue') }"
                    class="q-mr-xs"
                />Blue rocks
            </h4>
            <h5>{{ cleanNumber(withBlue) }}</h5>
        </div>

        <q-separator class="separator"/>

        <div class="row__container row justify-between upcoming">
            <div>
                <h4>Season high</h4>
                <caption class="text-caption">
                    Coming soon
                </caption>
            </div>
            <h5>-</h5>
        </div>
        <div class="row__container row justify-between upcoming">
            <div>
                <h4>Season low</h4>
                <caption class="text-caption">
                    Coming soon
                </caption>
            </div>
            <h5>-</h5>
        </div>
        <div
            class="row__container row justify-between upcoming"
            v-if="homeRink?.id"
        >
            <div>
                <h4>
                    {{ homeRink.name }}
                </h4>
                <caption class="text-caption">
                    Coming soon
                </caption>
            </div>
            <h5>-</h5>
        </div>
        <div class="row__container row justify-between upcoming">
            <div>
                <h4>Worldwide</h4>
                <caption class="text-caption">
                    Coming soon
                </caption>
            </div>
            <h5>-</h5>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$upcoming-color: rgba(255, 255, 255, 0.7);
.details__container {
    margin-top: var(--space-xl);
    .row__container {
        margin-bottom: var(--space-sm);
        h5 {
            color: v-bind(color);
            @include md-text;
        }
        &.upcoming {
            h4 {
                color: $upcoming-color;
            }
        }
        caption {
            line-height: 1;
            white-space: nowrap;
            font-style: italic;
            color: $upcoming-color;
        }
        .plus-minus__text {
            @include text-caption;
            font-family: $font-family-secondary;
            color: white;
        }
    }
    .separator {
        background-color: v-bind(color);
        margin-bottom: var(--space-lg);
        margin-top: calc(var(--space-lg) - 4px);
    }

}
</style>
<script setup>
import { NON_PERCENT_STATS, STAT_COLORS, STAT_TYPES, STAT_FIELDS_TOTAL } from "@/constants/stats";
import TeamStatsTotal from "@/store/models/team-stats-total";
import TeamStats from "@/store/models/team-stats";
import Player from "@/store/models/player";
const props = defineProps({
    filters: Object,
    total: Number,
    type: String,
});
const { getColor } = useColor();
const color = getColor(STAT_COLORS[props.type]);

const { userTeamIds } = useTeam();

const { user: userId } = useUser();

const homeRink = computed(
    () => useRepo(Player).with("rink").where("id", userId.value).first()?.rink
);

const stats = computed(() => {
    return useRepo(TeamStatsTotal)
        .query()
        .whereIn("team_id", userTeamIds.value)
        .get();
});

const filteredTeamIds = computed(() => {
    if (!props.filters?.teams?.length) return userTeamIds.value
    return [...userTeamIds.value].filter((id) => props.filters.teams.includes(id))
})

const statsByGame = computed(() => {
    return (
        useRepo(TeamStats)
            .query()
            .whereIn("team_id", filteredTeamIds.value)
            .get()
    );
});

const getPlusMinus = (stat) => {
    if (isPercent) {
        return stat * 100;
    }
};

const { getCumulativeStat } = useStats();

const cleanNumber = (num) => {
    if (Number.isNaN(num)) return '-'

    if (isPercent) {
        return `${Number((num * 100).toFixed())}%`;
    }
    return `${num > 0 ? "+" : "-"}${num.toFixed(1)}`;
};



const SHOW_HAMMER_STATS = [STAT_TYPES.WINS];
const shouldShowHammerStats = SHOW_HAMMER_STATS.includes(props.type);

const isPercent = !NON_PERCENT_STATS.includes(props.type);

const withHammerFe = computed(() =>
    getCumulativeStat(
        statsByGame.value.filter(
            ({ hammer_first_end_count }) => !!hammer_first_end_count
        ),
        STAT_FIELDS_TOTAL[props.type]
    )
);
const withoutHammerFe = computed(() =>
    getCumulativeStat(
        statsByGame.value.filter(
            ({ hammer_first_end_count }) => !hammer_first_end_count
        ),
        STAT_FIELDS_TOTAL[props.type]
    )
);

const withoutHammerLe = computed(() =>
    getCumulativeStat(
        statsByGame.value.filter(
            ({ hammer_last_end_count }) => !hammer_last_end_count
        ),
        STAT_FIELDS_TOTAL[props.type]
    )
);
const withHammerLe = computed(() =>
    getCumulativeStat(
        statsByGame.value.filter(
            ({ hammer_last_end_count }) => !!hammer_last_end_count
        ),
        STAT_FIELDS_TOTAL[props.type]
    )
);
const withRed = computed(() =>
    getCumulativeStat(
        statsByGame.value.filter(({ color }) => color === "red"),
        STAT_FIELDS_TOTAL[props.type]
    )
);
const withYellow = computed(() =>
    getCumulativeStat(
        statsByGame.value.filter(({ color }) => color === "yellow"),
        STAT_FIELDS_TOTAL[props.type]
    )
);
const withBlue = computed(() =>
    getCumulativeStat(
        statsByGame.value.filter(({ color }) => color === "blue"),
        STAT_FIELDS_TOTAL[props.type]
    )
);
</script>
