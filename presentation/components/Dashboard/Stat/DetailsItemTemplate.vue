<template>
    <div class="details-item__container" :class="{subitem}">
        <div
            class="row__container row no-wrap justify-between items-center"
            :class="{
                subitem,
                expanded,
                clickable: !!slots.more,
                pos: positive,
                neg: !positive,
            }"
            @click="onClick"
        >
            <div>
                <h4 class="row no-wrap items-center">
                    <slot name="icon" />
                    <slot name="title" />

                    <span
                        class="text-caption font-secondary q-ml-xs"
                        v-if="slots.subtitle && subitem"
                    >
                        
                        <slot name="subtitle" />
                    </span>
                    <q-btn
                        dense
                        flat
                        round
                        :icon="expanded ? 'arrow_drop_down' : 'arrow_drop_up'"
                        size="0.5em"
                        v-if="slots.more"
                    />
                </h4>
                <h6
                    :class="{ hasIcon: !!slots.icon }"
                    v-if="slots.subtitle && !subitem"
                >
                    <slot name="subtitle" />
                </h6>
            </div>

            <div class="row items-end no-wrap">
                <div
                    class="text-caption q-mr-sm row no-wrap items-center" v-if="slots.diff"
                    
                >
                    <slot name="diff" />
                </div>
                <h5 v-if="slots.value">
                    <slot name="value" />
                </h5>
                 <div
                    class="text-caption q-mr-sm row no-wrap items-center"
                    v-if="slots.diff2"
                    
                >
                    <slot name="diff2" />
                </div>
                 <h5 v-if="slots.value2" class="q-pl-md">
                    <slot name="value2" />
                </h5>
            </div>
        </div>
        <div
            class="more__container"
            v-if="slots.more && expanded"
            :class="{
                pos: positive,
                neg: !positive,
            }"
        >
            <slot name="more" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
$upcoming-color: rgba(255, 255, 255, 0.7);
.details-item__container {
    &.subitem {
&:nth-child(odd) {
        background-color: rgba(0,0,0,0.1);
    }
    }
    
    .row__container {
        margin-bottom: var(--space-sm);

        h5 {
            @include md-text;
        }
        h4 {
            color: rgba(255,255,255, 0.9);
            
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
            background-color: v-bind(color);
            // &.pos {
            //     background-color: $app-mint;
            // }
            // &.neg {
            //     background-color: $app-red;
            // }

            
            border-radius: 8px;
            .q-icon {
                color: white !important;
            }
            margin-bottom: unset;
            transform: scale(1.04);
            &:not(.subitem) {
                padding: var(--space-xs);
            }
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
            }
        }
        &.neg {
        }
        &:before {
            background-color: v-bind(color);
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
const slots = useSlots();
const props = defineProps({
    color: String,
    positive: Boolean,
    subitem: Boolean,
    modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

// const expanded = computed({
//     get() {
//         return props.modelValue;
//     },
//     set(val) {
//         emit("update:modelValue", val);
//     },
// });
const expanded = ref(false)

const onClick = () => {
    if (!slots.more) return;
    expanded.value = !expanded.value;
};
</script>
