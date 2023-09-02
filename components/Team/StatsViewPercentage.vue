<template>
    <div class="line-container">
        <div class="row items-center justify-between title">
            <div>
                <div class="row">
                    <h2 class="text-md q-mr-md text-bold clickable">
                        {{ BADGE_TITLES_PLAIN[badge] }}
                    </h2>
                    <q-btn
                        flat
                        round
                        icon="stacked_line_chart"
                        :color="visible ? BADGE_COLORS[badge] : 'grey-8'"
                        dense
                        @click="emit('showMore')"
                        v-if="!noDetails"
                    />
                </div>
                <h3 class="text-sm clickable">
                    {{ BADGE_DESCRIPTIONS_PLAIN[badge] }}
                </h3>
            </div>
            <div
                :style="{ height: BADGE_DIMENSION, width: BADGE_DIMENSION, position: 'relative' }"
                ref="badgeContainer"
            >
                <div
                    ref="badgeRef"
                    class="badge--viewable column items-center"
                    @click="expandBadge"
                    :class="{ expanded: viewBadge }"
                >
                    <div class="badge-container__wrap">
                        <Badge
                            :badge="badge"
                            :height="BADGE_DIMENSION"
                            class="clickable "
                        >
                            <div
                                class="badge-progress"
                                v-if="!hasBadge(teamId, badge)"
                            />
                        </Badge>
                          <div v-show="viewBadge" class="badge__title">
                        <h4 class="text-bold" style="white-space: nowrap">
                            {{ BADGE_TITLES[badge] }}
                        </h4>
                        <div>{{ BADGE_FORMULA_EXPLANATIONS[badge] }}</div>
                        <div
                            class="text-sm no-badge__container"
                            
                        >
                        <span v-if="percent < BADGE_THRESHOLDS[badge]">
                            Your team requires {{ BADGE_THRESHOLDS[badge] }}% or
                            greater to attain this badge.

                        </span>
                        <span v-else>
                            Your team has achieved this badge with <span class="text-bold">{{percent.toFixed(1)}}%</span>!
                        </span>
                        </div>
                    </div>
                    </div>
                  
                </div>
            </div>
        </div>
        <Percentage
            :color="BADGE_COLORS[badge]"
            :percent="percent"
            height="16px"
            :reverse="reverse"
        >
            <div
                class="threshold-indicator"
                :style="{
                    left: reverse ? `calc(${Math.abs(BADGE_THRESHOLDS[badge] - 100)}% - 16px)` : `calc(${BADGE_THRESHOLDS[badge]}% - 16px)`,
                }"
            >
                <q-icon
                    name="arrow_drop_down"
                    dense
                    size="2em"
                    :color="BADGE_COLORS[badge]"
                />
            </div>
            <div
                class="threshold-indicator down"
                :style="{
                    left: reverse ? `calc(${Math.abs(BADGE_THRESHOLDS[badge] - 100)}% - 16px)` : `calc(${BADGE_THRESHOLDS[badge]}% - 16px)`,
                }"
            >
                <q-icon
                    name="arrow_drop_up"
                    dense
                    size="2em"
                    :color="BADGE_COLORS[badge]"
                />
            </div>
            <q-tooltip anchor="top middle" self="bottom middle">
                {{ numerator }} out of {{ denominator }}
                {{ gameStat ? "games" : "ends" }}
            </q-tooltip>

            <template v-slot:append>
                <div class="percent__container">{{ percent.toFixed() }}%</div>
            </template>
        </Percentage>
    </div>
</template>

<style lang="scss">
.line-container {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid $grey-4;
    padding: var(--space-md) 0px;
    .q-linear-progress {
        border-radius: 12px;
    }
    .title {
        margin-bottom: var(--space-md);
    }
    .badge-progress {
        position: absolute;
        right: 0;
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        padding: 2px;
        background-color: rgba(0, 0, 0, 0.2);
        -webkit-backdrop-filter: grayscale(1);
        backdrop-filter: grayscale(1);
        // border-radius: 50%;
    }
    .badge--viewable {
        transition: all 0.3s;
        position: relative;
     

        &.expanded {
            transform: v-bind(transformation);
            transform-origin: top left;
            // transform: scale(3) translateX(-50px);
            z-index: 100000;
            position: absolute;
               width: 100px;
               left: 0;
               right: 0;
               margin: auto;
            .badge__title {
                //    position: absolute;
              
                text-align: center;
                // margin-top: -50%;
                transform: scale(0.3) translateY(-100%);
                background-color: white;
                padding: var(--space-xs);
                border-radius: 8px;
                border: 1px solid $grey-4;
                      width: 200px;
                .no-badge__container {
                    padding: var(--space-xxxs);
                    border-radius: 8px;
                    border: 1px solid black;
                }
                // >div, h4 {
                //     
                // }
            }
             .badge-container__wrap {
                display: flex;
                flex-direction: column;
                align-items: center;
                max-height: 100px;
                width: 100%;
            // max-height: 4em;
            // max-width: 4em;
            // display: grid;
            // grid-template-rows: repeat(2, 50%);
            // height: v-bind(BADGE_DIMENSION);
            // width: v-bind(BADGE_DIMENSION);
        }
        }

       
    }

    .threshold-indicator {
        opacity: 0.5;
        position: absolute;
        top: calc(-2em + 8px);
        &.down {
            top: unset;
            bottom: calc(-2em + 8px);
        }
    }
    .percent__container {
        width: v-bind(BADGE_DIMENSION);
        display: flex;
        margin-left: var(--space-xs);
        justify-content: center;
        font-weight: bold;
    }
}
</style>

<script setup>
import {
    BADGE_COLORS,
    BADGE_THRESHOLDS,
    BADGE_TITLES_PLAIN,
    BADGE_DESCRIPTIONS_PLAIN,
    BADGE_TITLES,
    BADGE_FORMULA_EXPLANATIONS,
} from "@/constants/badges";
import {
    onClickOutside,
    useElementBounding,
    useWindowSize,
} from "@vueuse/core";
const props = defineProps({
    badge: String,
    gameStat: Boolean,
    noDetails: Boolean,
    numerator: Number,
    denominator: Number,
    reverse: Boolean,
    teamId: Number,
    visible: Boolean,
});

const emit = defineEmits(["showMore"]);

const percent = (props.numerator / props.denominator) * 100;

const viewBadge = ref(false);

const badgeRef = ref(null);

const {hasBadge} = useBadge();

onClickOutside(badgeRef, () => {
    viewBadge.value = false;
});

const BADGE_DIMENSION = "3em";
const EXPANDED_SCALE = 3;

const badgeContainer = ref(null);

const { x, y } = useElementBounding(badgeContainer);

const { height, width } = useWindowSize();

const transformation = ref(null);

const $q = useQuasar();

const getTransformation = () => {
    const widthHalf = width.value / 2;
    const heightHalf = height.value / 2;
    const outsideBounds = height.value - y.value;
    transformation.value = `scale(${EXPANDED_SCALE}) translateY(${$q.screen.lt.sm ? (heightHalf - y.value - 100) / EXPANDED_SCALE : 0}px)
   translateX(${-75}px)`;
    //  
    // `
};

const expandBadge = () => {
    // if (percent < BADGE_THRESHOLDS[props.badge]) return;
    if (!viewBadge.value) {
        getTransformation();
    }

    viewBadge.value = !viewBadge.value;
};
</script>
