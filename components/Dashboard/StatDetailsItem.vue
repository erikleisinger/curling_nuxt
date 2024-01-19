<template>
    <div class="details-item__container">
        <div
            class="row__container row no-wrap justify-between items-center"
            :class="{
                subitem,
                expanded,
                clickable: !!slots.more,
                pos: POS_STATS.includes(statField),
                neg: NEG_STATS.includes(statField),
            }"
            @click="onClick"
        >
            <div>
                <h4>
                    <q-icon
                        name="circle"
                        size="0.7em"
                        :style="{ color: getColor(statField) }"
                        class="q-mr-xs"
                        v-if="COLOR_STATS.includes(statField)"
                    />
                    <q-icon
                        name="o_hardware"
                        size="0.9em"
                        :style="{
                            color: 'white',
                        }"
                        class="q-mr-xs"
                        v-if="HAMMER_STATS.includes(statField)"
                    />
                    <q-icon
                        name="check_circle"
                        size="0.9em"
                        :style="{ color: getColor('mint') }"
                        class="q-mr-xs"
                        v-if="POS_STATS.includes(statField)"
                    />
                    <q-icon
                        name="cancel"
                        size="0.9em"
                        :style="{ color: getColor('red') }"
                        class="q-mr-xs"
                        v-if="NEG_STATS.includes(statField)"
                    />
                 
                    {{ STAT_FIELD_TITLES[statField](statType) }}
                       <span class="text-caption font-secondary" v-if="subtitle && subitem">
                       {{subtitle}}
                    </span>
                    <q-btn dense flat round :icon="expanded ? 'arrow_drop_down' : 'arrow_drop_up'" size="0.5em" v-if="slots.more"/>
                </h4>
                <h6 :class="{ hasIcon }" v-if="subtitle && !subitem">
                   {{subtitle}}
                </h6>
            </div>
            <div  class="stat-line">
                <span style="visibility:hidden">a</span>
            </div>

            <div class="row items-end no-wrap">
                <div class="text-caption q-mr-sm row no-wrap items-center" v-if="hasValue && showAvgDiff">
                    <q-icon
                    v-if="avgDiff !== 0"
                        :name="
                            avgDiff > 0 ? 'arrow_drop_up' : 'arrow_drop_down'
                        "
                        :style="{
                            color:
                                avgDiff > 0
                                    ? getColor('mint')
                                    : getColor('red'),
                        }"
                    />

                   <span v-if="avgDiff"> {{ avgDiff }}{{ isPercent ? "%" : "" }}</span>
                   <span v-else>-</span>
                </div>
                <h5 :style="{ color }">{{ cleanNumber(value) }}</h5>
            </div>
        </div>
        <div
            class="more__container"
            v-if="slots.more && expanded"
            :class="{
                pos: POS_STATS.includes(statField),
                neg: NEG_STATS.includes(statField),
            }"
        >
            <slot name="more" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
$upcoming-color: rgba(255, 255, 255, 0.7);
.details-item__container {
    .row__container {
        margin-bottom: var(--space-sm);
      

        h5 {
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
        &.subitem {
            margin-left: var(--space-xs);

            margin-bottom: var(--space-xxs) !important;
            h4 {
                @include reg-text;
            }
            h5 {
                @include smmd-text;
            }
        }
        transition: all 0.2s;
        &.expanded {
            &.pos {
                background-color: $app-mint;
            }
            &.neg {
                background-color: $app-red;
            }

            padding: var(--space-xs);
            border-radius: 8px;
            .q-icon {
                color: white !important;
            }
            margin-bottom: unset;
            transform: scale(1.04);
        }

        h6 {
            font-family: $font-family-secondary;
            @include text-caption;
            margin-top: -4px;
            font-weight: normal;
            font-style: italic;

            &.hasIcon {
                margin-left: 2em;
            }
        }
    }

    .more__container {
        width: 100%;
        padding: var(--space-sm) var(--space-md);
        position: relative;
        border-radius: 8px;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.2);
        margin-bottom: var(--space-sm);
        &:before {
            content: "";

            height: 100%;
            width: 8px;
            top: 0;
            left: 0;
            bottom: 0;
            position: absolute;
        }
        &.pos {
            &:before {
                background-color: $app-mint;
            }
        }
        &.neg {
            &:before {
                background-color: $app-red;
            }
        }
        .row__container {
            &:last-child {
                margin-bottom: unset !important;
            }
        }
    }

    .stat-line {
        flex-grow: 1; 
        height: 100%;
        position: relative;
        overflow: hidden;
    }
}
</style>
<script setup>
import {
    STAT_FIELDS_TOTAL,
    STAT_FIELDS,
    STAT_FIELD_FILTER_FUNCTIONS,
    STAT_COLORS,
    STAT_TYPE_SUBTITLES,
    NON_PERCENT_STATS,
    STAT_FIELD_TITLES,
    STAT_TYPES,
} from "@/constants/stats";
import TeamStats from "@/store/models/team-stats";
const props = defineProps({
    alwaysNumber: Boolean,
    average: Number,
    filters: Object,
    statField: String,
    statType: String,
    subitem: Boolean,
});

const { getColor } = useColor();

const slots = useSlots();

const COLOR_STATS = [STAT_FIELDS.YELLOW, STAT_FIELDS.RED, STAT_FIELDS.BLUE];

const HAMMER_STATS = [
    STAT_FIELDS.WITH_HAMMER,
    STAT_FIELDS.WITHOUT_HAMMER,

];
const HAMMER_POS = [
    STAT_FIELDS.WITH_HAMMER,
    STAT_FIELDS.WITH_HAMMER_LE,
    STAT_FIELDS.WITH_HAMMER_2LE,
     STAT_FIELDS.WITH_HAMMER_3LE,
];

const POS_STATS = [STAT_FIELDS.WITH_HAMMER_LE, STAT_FIELDS.WITH_HAMMER_2LE, STAT_FIELDS.WITH_HAMMER_3LE, STAT_FIELDS.WITH_HAMMER_EE];
const NEG_STATS = [
    STAT_FIELDS.WITHOUT_HAMMER_LE,
    STAT_FIELDS.WITHOUT_HAMMER_2LE,
     STAT_FIELDS.WITHOUT_HAMMER_3LE,
     STAT_FIELDS.WITHOUT_HAMMER_EE
];



const hasIcon =
    COLOR_STATS.includes(props.statField) ||
    HAMMER_STATS.includes(props.statField) ||
    POS_STATS.includes(props.statField) ||
    NEG_STATS.includes(props.statField);

const { userTeamIds } = useTeam();

const filteredTeamIds = computed(() => {
    if (!props.filters?.teams?.length) return userTeamIds.value;
    return [...userTeamIds.value].filter((id) =>
        props.filters.teams.includes(id)
    );
});

const stats = computed(() => {
    return useRepo(TeamStats)
        .query()
        .whereIn("team_id", filteredTeamIds.value)
        .where("rink_id", (val) => {
            return props.filters.rink ? val === props.filters.rink : true;
        })
        .where("sheet_id", (val) => {
            return props.filters.sheet ? val === props.filters.sheet : true;
        })
        .get();
});

const subtitle = computed(() => {
    if (!STAT_TYPE_SUBTITLES[props.statField]) return null;
    return STAT_TYPE_SUBTITLES[props.statField](stats.value)
})

const { getCumulativeStat } = useStats();

const value = computed(() => getCumulativeStat(
        stats.value.filter(STAT_FIELD_FILTER_FUNCTIONS[props.statField]),
        STAT_FIELDS_TOTAL[props.statField] ?? STAT_FIELDS_TOTAL[props.statType]
    )  
);
const color = computed(() =>
    Number.isNaN(value.value)
        ? "inherit"
        : value.value > props.average
        ? "inherit"
        : "inherit"
);

const isPercent =
    !props.alwaysNumber && !NON_PERCENT_STATS.includes(props.statType);

const hasValue = computed(() => !Number.isNaN(value.value));

const showAvgDiff = computed(() => props.statField !== STAT_FIELDS.WITH_HAMMER && props.statType !== STAT_TYPES.HAMMER_EFFICIENCY)

const avgDiff = computed(() =>
    Number((value.value * (isPercent ? 100 : 1) - props.average).toFixed(1))
);

const cleanNumber = (num) => {
    if (!hasValue.value) return "-";
    if (isPercent) {
        return `${Number((num * 100).toFixed())}%`;
    }

    return `${num > 0 ? "" : ""}${num.toFixed(1)}`;
};

const expanded = ref(false);

const onClick = () => {
    if (!slots.more) return;
    expanded.value = !expanded.value;
};
</script>
