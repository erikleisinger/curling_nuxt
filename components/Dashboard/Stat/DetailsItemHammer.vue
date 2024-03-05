<template>
    <div
        class="row items-center q-mb-sm justify-between"
        @click="onClick"
    >
        <div class="row items-center">
            <IconEnd :cols="cols" width="60" color="white" />
            <div
                class="smmd-text font-header"
                :class="{ 'q-ml-md': field === 'extra_end' }"
            >
                {{ title }}
            </div>

            <q-icon
            v-if="field !== 'extra_end'"
                :name="showMore ? 'arrow_drop_up' : 'arrow_drop_down'"
                class="q-ml-sm"
                size="1.4em"
                dense
            ></q-icon>
        </div>
    </div>
    <div class="row full-height justify-end q-mb-md">
        <div class="text-caption font-header hammer-col" style="line-height: 1">
            With
        </div>
        <div class="text-caption font-header hammer-col q-ml-md" style="line-height: 1">
            Without
        </div>
    </div>



    <DashboardStatDetailsItemTemplate>
        <template v-slot:title> Overall </template>
      
        <template v-slot:value>
            <div class="row hammer-col" >
    
        
            <div
                :style="{ color: getColor('mint') }"
                class=""
            >
            <div v-if="!Number.isNaN(stats.overall.field1)">
                {{ stats.overall.field1.toFixed()
                }}<span style="font-size: 0.9rem">%</span>
            </div>
            <div v-else>-</div>
            </div>
            <div class="games-counter">({{stats.overall.field1Count}}/{{props.stats.length}})</div>
            </div>
        </template>
      
        <template v-slot:value2>
            <div class="row hammer-col">

            <div
                :style="{ color: getColor('red') }"
             
            >
            <div v-if="!Number.isNaN(stats.overall.field2)">
                {{ stats.overall.field2.toFixed()
                }}<span style="font-size: 0.9rem;">%</span>
            </div>
            <div v-else>-</div>
            </div>
              <div class="games-counter">({{stats.overall.field2Count}}/{{props.stats.length}})</div>
            </div>
        </template>
    </DashboardStatDetailsItemTemplate>
    <div v-if="showMore" class="showmore-container">
         <DashboardStatDetailsItemTemplate subitem v-for="stat in Object.keys(stats).filter((key) => key !== 'overall')" :key="stat">
            <template v-slot:title>
                {{fieldTitles[stat]}} <span>{{ stats[stat].field1sub }}</span>
            </template>
            <template v-slot:value>
                <div
                    :style="{ color: getColor('mint') }"
                    class="hammer-col text-right"
                >
                <div v-if="!Number.isNaN(stats[stat].field1)">
                    {{ stats[stat].field1.toFixed()
                    }}
                    <span style="font-size: 0.8rem; margin-left: -6px">%</span>
                </div>
                  <div v-else>-</div>
                    <div class="games-counter">({{stats[stat].field1Count}}/{{props.stats.length}})</div>
                </div>
            </template>
            <template v-slot:value2>
                <div
                    :style="{ color: getColor('red') }"
                    class="hammer-col text-right"
                >
                <div v-if="!Number.isNaN(stats[stat].field2)">
                    {{ stats[stat].field2.toFixed()
                    }}
                      <span style="font-size: 0.8rem; margin-left: -6px">%</span>
                </div>
                <div v-else>-</div>
                  <div class="games-counter">({{stats[stat].field2Count}}/{{props.stats.length}})</div>
                </div>
            </template>
        </DashboardStatDetailsItemTemplate>

    </div>
</template>
<style lang="scss" scoped>
.hammer-col {
    width: 100px;
    text-align: right;
    justify-content: flex-end;
    align-items: flex-end;
    flex-wrap: nowrap;
    display: flex;
    .games-counter {
        @include text-caption;
        margin-left: var(--space-xs);
        font-family: $font-family-secondary;
        color: rgba(255,255,255,0.8);
    }
}
.showmore-container {
    border-left: 2px solid;
}
</style>
<script setup>
import {
    STAT_FIELDS,
    STAT_TYPES,
    STAT_FIELD_FILTER_FUNCTIONS,
} from "@/constants/stats";
import { defaultFieldCalculator } from "@/utils/stats";
const props = defineProps({
    average: Number,
    field: {
        type: String,
        default: "last_end",
    },
    stats: Array,
});
const { getColor } = useColor();
const showMore = ref(false);

const fieldTitles = {
    down1: 'Down 1',
    down2: 'Down 2+',
    tied: 'Tied',
    up1: 'Up 1',
    up2: 'Up 2+'
}

const title = {
    last_end: "Last end",
    extra_end: "Extra end",
    "2nd_last_end": "2nd-last end",
    "3rd_last_end": "3rd-last end",
}[props.field];

const cols = {
    last_end: 3,
    extra_end: 4,
    "2nd_last_end": 2,
    "3rd_last_end": 1,
}[props.field];

const fields = {
    last_end: {
        overall: {
            field1: STAT_FIELDS.WITH_HAMMER_LE,
            field2: STAT_FIELDS.WITHOUT_HAMMER_LE,
        },
        up2: {
            field1: STAT_FIELDS.WITH_HAMMER_LE_U2,
            field2: STAT_FIELDS.WITHOUT_HAMMER_LE_U2,
        },
        up1: {
            field1: STAT_FIELDS.WITH_HAMMER_LE_U1,
            field2: STAT_FIELDS.WITHOUT_HAMMER_LE_U1,
        },
        tied: {
            field1: STAT_FIELDS.WITH_HAMMER_LE_TIE,
            field2: STAT_FIELDS.WITHOUT_HAMMER_LE_TIE,
        },
        down1: {
            field1: STAT_FIELDS.WITH_HAMMER_LE_D1,
            field2: STAT_FIELDS.WITHOUT_HAMMER_LE_D1,
        },
        down2: {
            field1: STAT_FIELDS.WITH_HAMMER_LE_D2,
            field2: STAT_FIELDS.WITHOUT_HAMMER_LE_D2,
        },
    },
    extra_end: {
        overall: {
            field1: STAT_FIELDS.WITH_HAMMER_EE,
            field2: STAT_FIELDS.WITHOUT_HAMMER_EE,
        },
    },
    "2nd_last_end": {
        overall: {
            field1: STAT_FIELDS.WITH_HAMMER_2LE,
            field2: STAT_FIELDS.WITHOUT_HAMMER_2LE,
        },
        up2: {
            field1: STAT_FIELDS.WITH_HAMMER_2LE_U2,
            field2: STAT_FIELDS.WITHOUT_HAMMER_2LE_U2,
        },
        up1: {
            field1: STAT_FIELDS.WITH_HAMMER_2LE_U1,
            field2: STAT_FIELDS.WITHOUT_HAMMER_2LE_U1,
        },
        tied: {
            field1: STAT_FIELDS.WITH_HAMMER_2LE_TIE,
            field2: STAT_FIELDS.WITHOUT_HAMMER_2LE_TIE,
        },
        down1: {
            field1: STAT_FIELDS.WITH_HAMMER_2LE_D1,
            field2: STAT_FIELDS.WITHOUT_HAMMER_2LE_D1,
        },
        down2: {
            field1: STAT_FIELDS.WITH_HAMMER_2LE_D2,
            field2: STAT_FIELDS.WITHOUT_HAMMER_2LE_D2,
        },
    },
    "3rd_last_end": {
        overall: {
            field1: STAT_FIELDS.WITH_HAMMER_3LE,
            field2: STAT_FIELDS.WITHOUT_HAMMER_3LE,
        },
        up2: {
            field1: STAT_FIELDS.WITH_HAMMER_3LE_U2,
            field2: STAT_FIELDS.WITHOUT_HAMMER_3LE_U2,
        },
        up1: {
            field1: STAT_FIELDS.WITH_HAMMER_3LE_U1,
            field2: STAT_FIELDS.WITHOUT_HAMMER_3LE_U1,
        },
        tied: {
            field1: STAT_FIELDS.WITH_HAMMER_3LE_TIE,
            field2: STAT_FIELDS.WITHOUT_HAMMER_3LE_TIE,
        },
        down1: {
            field1: STAT_FIELDS.WITH_HAMMER_3LE_D1,
            field2: STAT_FIELDS.WITHOUT_HAMMER_3LE_D1,
        },
        down2: {
            field1: STAT_FIELDS.WITH_HAMMER_3LE_D2,
            field2: STAT_FIELDS.WITHOUT_HAMMER_3LE_D2,
        },
    },
};

const stats = computed(() => {
    return {
        overall: {
            field1: 
                defaultFieldCalculator(fields[props.field].overall.field1)({
                    stats: props.stats,
                    statType: STAT_TYPES.WINS,
                }) * 100,
                field1Count: props.stats.filter(STAT_FIELD_FILTER_FUNCTIONS[fields[props.field].overall.field1]).length,

            field2: 
                defaultFieldCalculator(fields[props.field].overall.field2)({
                    stats: props.stats,
                    statType: STAT_TYPES.WINS,
                }) * 100,
                field2Count: props.stats.filter(STAT_FIELD_FILTER_FUNCTIONS[fields[props.field].overall.field2]).length,
        },
        ...(props.field === "extra_end"
            ? {}
            : {
                  up2: {
                      field1:
                          defaultFieldCalculator(
                              fields[props.field].up2.field1
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                          field1Count: props.stats.filter(STAT_FIELD_FILTER_FUNCTIONS[fields[props.field].up2.field1]).length,
                      field2:
                          defaultFieldCalculator(
                              fields[props.field].up2.field2
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                          field2Count: props.stats.filter(STAT_FIELD_FILTER_FUNCTIONS[fields[props.field].up2.field2]).length,
                  },
                  up1: {
                      field1:
                          defaultFieldCalculator(
                              fields[props.field].up1.field1
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                          field1Count: props.stats.filter(STAT_FIELD_FILTER_FUNCTIONS[fields[props.field].up1.field1]).length,
                      field2:
                          defaultFieldCalculator(
                              fields[props.field].up1.field2
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                          field2Count: props.stats.filter(STAT_FIELD_FILTER_FUNCTIONS[fields[props.field].up1.field2]).length,
                  },
                  tied: {
                      field1:
                          defaultFieldCalculator(
                              fields[props.field].tied.field1
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                          field1Count: props.stats.filter(STAT_FIELD_FILTER_FUNCTIONS[fields[props.field].tied.field1]).length,
                      field2:
                          defaultFieldCalculator(
                              fields[props.field].tied.field2
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                          field2Count: props.stats.filter(STAT_FIELD_FILTER_FUNCTIONS[fields[props.field].tied.field2]).length,
                  },
                  down1: {
                      field1:
                          defaultFieldCalculator(
                              fields[props.field].down1.field1
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                          field1Count: props.stats.filter(STAT_FIELD_FILTER_FUNCTIONS[fields[props.field].down1.field1]).length,
                      field2:
                          defaultFieldCalculator(
                              fields[props.field].down1.field2
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                          field2Count: props.stats.filter(STAT_FIELD_FILTER_FUNCTIONS[fields[props.field].down1.field2]).length,
                  },
                  down2: {
                      field1:
                          defaultFieldCalculator(
                              fields[props.field].down2.field1
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                          field1Count: props.stats.filter(STAT_FIELD_FILTER_FUNCTIONS[fields[props.field].down2.field1]).length,
                      field2:
                          defaultFieldCalculator(
                              fields[props.field].down2.field2
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                          field2Count: props.stats.filter(STAT_FIELD_FILTER_FUNCTIONS[fields[props.field].down2.field2]).length,
                  },
              }),
    };
});

const onClick = () => {
    if (props.field === 'extra_end') return;
    showMore.value = !showMore.value
}
</script>
