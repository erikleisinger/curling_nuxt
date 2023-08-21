<template>

            <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
                ref="popup"
                @hide="onHide"
            >
                <q-date
                    v-model="val"
                    mask="YYYY-MM-DD HH:mm"
                    @update:model-value="selectDate = false"
                    v-show="selectDate"
                />
                <q-time
                    v-model="val"
                    mask="YYYY-MM-DD HH:mm"
                    @update:model-value="endSelection"
                    v-show="!selectDate"
                    :minute-options="[
                        0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55,
                    ]"
                />
            </q-popup-proxy>
</template>
<style lang="scss" scoped>
.q-chip {
    margin: unset;
}
</style>
<script setup lang="ts">
import { ref } from "vue";
const props = defineProps({
    modelValue: String,
    name: String,
    label: String,
});

const inputText = computed(() => formatted.value || props.label);

const val = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        return emit("update:modelValue", val);
    },
});
const selectDate = ref(true);
const popup = ref(null);
const formatted = computed(() => {
    if (!props.modelValue) return "Select a time";
    const { format } = useTime();
    return format(props.modelValue, "MMM D, YYYY [at] h:mm A");
});

const selectedMinute = ref(false);

const endSelection = (value: string | null, details: object) => {
    if (popup.value && selectedMinute.value) {
        popup.value.hide();

    } else {
        selectedMinute.value = true;
    }
};

const onHide = () => {
        selectDate.value = true;
        selectedMinute.value = false;
}

const emit = defineEmits(["update:modelValue"]);
</script>
