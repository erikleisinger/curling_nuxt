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
            <div class="row hammer-col">
    
        
            <div
                :style="{ color: getColor('mint') }"
                class=""
            >
            
                {{ stats.overall.field1.toFixed()
                }}<span style="font-size: 0.9rem">%</span>
            </div>
            </div>
        </template>
      
        <template v-slot:value2>
            <div class="row hammer-col">

            <div
                :style="{ color: getColor('red') }"
             
            >
                {{ stats.overall.field2.toFixed()
                }}<span style="font-size: 0.9rem">%</span>
            </div>
            </div>
        </template>
    </DashboardStatDetailsItemTemplate>
    <div v-if="showMore" class="showmore-container">
        <DashboardStatDetailsItemTemplate subitem>
            <template v-slot:title>
                Up 2+ <span>{{ stats.up2.field1sub }}</span>
            </template>
            <template v-slot:value>
                <div
                    :style="{ color: getColor('mint') }"
                    class="hammer-col text-right"
                >
                    {{ stats.up2.field1
                    }}<span style="font-size: 0.9rem">%</span>
                </div>
            </template>
            <template v-slot:value2>
                <div
                    :style="{ color: getColor('red') }"
                    class="hammer-col text-right"
                >
                    {{ stats.up2.field2
                    }}<span style="font-size: 0.9rem">%</span>
                </div>
            </template>
        </DashboardStatDetailsItemTemplate>
        <DashboardStatDetailsItemTemplate subitem>
            <template v-slot:title> Up 1 </template>
            <template v-slot:value>
                <div
                    :style="{ color: getColor('mint') }"
                    class="hammer-col text-right"
                >
                    0<span style="font-size: 0.9rem">%</span>
                </div>
            </template>
            <template v-slot:value2>
                <div
                    :style="{ color: getColor('red') }"
                    class="hammer-col text-right"
                >
                    100<span style="font-size: 0.9rem">%</span>
                </div>
            </template>
        </DashboardStatDetailsItemTemplate>
        <DashboardStatDetailsItemTemplate subitem>
            <template v-slot:title> Tied </template>
            <template v-slot:value>
                <div
                    :style="{ color: getColor('mint') }"
                    class="hammer-col text-right"
                >
                    0<span style="font-size: 0.9rem">%</span>
                </div>
            </template>
            <template v-slot:value2>
                <div
                    :style="{ color: getColor('red') }"
                    class="hammer-col text-right"
                >
                    0<span style="font-size: 0.9rem">%</span>
                </div>
            </template>
        </DashboardStatDetailsItemTemplate>
        <DashboardStatDetailsItemTemplate subitem>
            <template v-slot:title> Down 1 </template>
            <template v-slot:value>
                <div
                    :style="{ color: getColor('mint') }"
                    class="hammer-col text-right"
                >
                    100<span style="font-size: 0.9rem">%</span>
                </div>
            </template>
            <template v-slot:value2>
                <div
                    :style="{ color: getColor('red') }"
                    class="hammer-col text-right"
                >
                    100<span style="font-size: 0.9rem">%</span>
                </div>
            </template>
        </DashboardStatDetailsItemTemplate>
        <DashboardStatDetailsItemTemplate subitem>
            <template v-slot:title> Down 2+ </template>
            <template v-slot:value>
                <div
                    :style="{ color: getColor('mint') }"
                    class="hammer-col text-right"
                >
                    0<span style="font-size: 0.9rem">%</span>
                </div>
            </template>
            <template v-slot:value2>
                <div
                    :style="{ color: getColor('red') }"
                    class="hammer-col text-right"
                >
                    100<span style="font-size: 0.9rem">%</span>
                </div>
            </template>
        </DashboardStatDetailsItemTemplate>
    </div>
</template>
<style lang="scss" scoped>
.hammer-col {
    width: 50px;
    text-align: right;
    justify-content: flex-end;
    align-items: center;
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

            field2: 
                defaultFieldCalculator(fields[props.field].overall.field2)({
                    stats: props.stats,
                    statType: STAT_TYPES.WINS,
                }) * 100,
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
                      field2:
                          defaultFieldCalculator(
                              fields[props.field].up2.field2
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                  },
                  up1: {
                      field1:
                          defaultFieldCalculator(
                              fields[props.field].up1.field1
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                      field2:
                          defaultFieldCalculator(
                              fields[props.field].up1.field2
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                  },
                  tied: {
                      field1:
                          defaultFieldCalculator(
                              fields[props.field].tied.field1
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                      field2:
                          defaultFieldCalculator(
                              fields[props.field].tied.field2
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                  },
                  down1: {
                      field1:
                          defaultFieldCalculator(
                              fields[props.field].down1.field1
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                      field2:
                          defaultFieldCalculator(
                              fields[props.field].down1.field2
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                  },
                  down2: {
                      field1:
                          defaultFieldCalculator(
                              fields[props.field].down2.field1
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                      field2:
                          defaultFieldCalculator(
                              fields[props.field].down2.field2
                          )({ stats: props.stats, statType: STAT_TYPES.WINS }) *
                          100,
                  },
              }),
    };
});

const onClick = () => {
    if (props.field === 'extra_end') return;
    showMore.value = !showMore.value
}
</script>
