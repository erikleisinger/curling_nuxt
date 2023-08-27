<template>
    <q-chip
        dense
        icon="stars"
        :icon-right="canEdit && !isRevealed ? 'edit' : null"
        :color="chipColor"
        :text-color="chipTextColor"
        rounded
        @click="onChipClick"
        ref="chip"
        class="admin-chip"
        clickable
    >
        <span v-if="!canEdit || !isRevealed">
            {{ props.modelValue ? "Admin" : "Not admin" }}
        </span>
        <span v-else-if="isRevealed">
            {{ props.modelValue ? "Remove admin?" : "Make admin?" }}
        </span>
    </q-chip>
</template>
<style lang="scss" scoped>
.admin-chip {
    padding: 0px 10px;
}
</style>
<script setup>
import { useConfirmDialog, onClickOutside } from "@vueuse/core";
const props = defineProps({
    canEdit: Boolean,
    modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const { confirm, cancel, reveal, isRevealed, onConfirm } = useConfirmDialog();

const onChipClick = () => {
    if (!props.canEdit) return;
    console.log("chip: ", isRevealed.value);
    if (!isRevealed.value) {
        reveal();
    } else {
        confirm();
    }
};

onConfirm(() => {
    emit("update:modelValue", !props.modelValue);
});

const chipColor = computed(() => {
    if (isRevealed.value) {
        return props.modelValue ? "negative" : "positive";
    } else {
        return props.modelValue ? "primary" : "grey-4";
    }
});

const chipTextColor = computed(() => {
    if (isRevealed.value) return "white";
    return props.modelValue ? "white" : "black";
});

const chip = ref(null);
onClickOutside(chip, () => cancel());
</script>
