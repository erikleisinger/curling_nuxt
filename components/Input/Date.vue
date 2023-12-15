<template>

            <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
                ref="popup"
                @hide="onHide"
                v-model="open"
            >
                <q-date
                    v-model="date"
                    mask="YYYY-MM-DD HH:mm"
                    @update:model-value="onSelectDate"
                    v-show="selectDate"
                    class="relative-position"
                >
    <div class="close-button__container">
<q-btn  flat round icon="check" color="white"  dense @click="save"/>
    </div>  
                </q-date>
                <q-time
                    v-model="date"
                    mask="YYYY-MM-DD HH:mm"
                    @update:model-value="onSelectTime"
                    v-show="!selectDate"
                    :minute-options="[
                        0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55,
                    ]"
                     class="relative-position"
                >
        <div class="close-button__container">
<q-btn  flat round icon="check" color="white"  dense @click="save"/>
    </div>  
                </q-time>
            </q-popup-proxy>
</template>
<style lang="scss" scoped>
.close-button__container {
    position: absolute;
    top: 25px;
    right: var(--space-sm);
}
.q-chip {
    margin: unset;
}
</style>
<script setup lang="ts">
import { ref } from "vue";
const props = defineProps({
    modelValue: [String, Number],
    name: String,
    label: String,
});

const date = ref(null);

const inputText = computed(() => formatted.value || props.label);

const open = ref(false)

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

const save = () => {
    popup.value.hide();
    emit('update:modelValue', date.value)
}

const selectedMinute = ref(false);

const onSelectTime = (value: string | null, details: object) => {
    date.value = value;
    if (!selectedMinute.value) selectedMinute.value = true;
};

const onHide = () => {
        selectDate.value = true;
        selectedMinute.value = false;
}

const onSelectDate = (val) => {
    date.value = val;
    selectDate.value = false
}

const emit = defineEmits(["update:modelValue"]);
</script>
