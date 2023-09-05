<template>
    <q-chip
        dense
        :icon="getIcon(props.modelValue)"
        :icon-right="canEdit ? 'edit' : null"
        color="grey-4"
        text-color="grey-10"
        rounded
        padding
        size="md"
        class="position-chip"
        >{{ getName(props.modelValue) }}

        <q-menu
            v-if="canEdit"
            style="background-color: transparent"
            transition-show="jump-down"
          transition-hide="jump-up"
            auto-close
        >
        <div class="column">
            <q-chip v-for="pos in Object.keys(positions)" :key="pos" :icon="getIcon(pos)" color="blue" text-color="white" clickable @click="emit('update:modelValue', positions[pos].value)">
                {{getName(pos)}}
            </q-chip>
        </div>
        </q-menu>
    </q-chip>
</template>
<style lang="scss" scoped>
    .position-chip {
        padding: 0px 10px;
    }
</style>
<script setup>
const props = defineProps({
    canEdit: Boolean,
    modelValue: String,
});

const emit = defineEmits(['update:modelValue'])

const positions = {
    lead: {
        name: "Lead",
        icon: "looks_one",
        value: "lead",
    },
    second: {
        name: "Second",
        icon: "looks_two",
        value: "second",
    },
    third: {
        name: "Third",
        icon: "looks_three",
        value: "third",
    },
    fourth: {
        name: "Fourth",
        icon: "looks_four",
        value: "fourth",
    },
    fifth: {
        name: "Fifth",
        icon: "looks_five",
        value: "fifth",
    },
    coach: {
        name: "Coach",
        icon: "assignment",
        value: "coach",
    },
    alternate: {
        name: "Alternate",
        icon: "exposure_zero",
        value: "alternate",
    },
    skip: {
        name: "Skip",
        icon: "psychology",
        value: "skip",
    },
};

const getName = (pos) => {
    return positions[pos]?.name || "Member";
};

const getIcon = (pos) => {
    return positions[pos]?.icon ?? "person";
};
</script>
