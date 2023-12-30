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
            :options="limitDate"
        >
            <div class="close-button__container">
                <q-btn
                    flat
                    round
                    icon="check"
                    color="white"
                    dense
                    @click="save"
                />
            </div>
        </q-date>
        <q-time
            v-model="date"
            mask="YYYY-MM-DD HH:mm"
            @update:model-value="onSelectTime"
            v-show="!selectDate"
            :minute-options="[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]"
            :options="limitTime"
            class="relative-position"
        >
            <div class="close-button__container">
                <q-btn
                    flat
                    round
                    icon="check"
                    color="white"
                    dense
                    @click="save"
                />
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
    dateOnly: Boolean,
    modelValue: [String, Number],
    name: String,
    label: String,
    limit: {
        type: Boolean,
        default: true,
    },
    limitPast: Boolean,
    timeOnly: Boolean,
});

const { toTimezone } = useTime();

const limitDate = (val) => {
    if (!props.limit && !props.limitPast) return true;
    const now = toTimezone(null, null, false, true).unix();
    if (props.limit) {

    return toTimezone(val, null, false, true).unix() <= now;
    } 
    return toTimezone(val, null, false, true).unix() >= now;

    
};
const dayjs = useDayjs();
const isTodaySelected = computed(() => {
    if (!date.value) return false;
    const selected = dayjs(date.value).format('YYYY-MM-DD');
    const now = dayjs().format('YYYY-MM-DD');
    return now === selected;
})

const limitTime = (val) => {
    if (props.timeOnly) return true;
    if (!props.limit) return true;
    if (!isTodaySelected) return true;
    const now = Number(toTimezone(null, "H"));
    return val <= now;
};

const date = ref(null);

const inputText = computed(() => formatted.value || props.label);

const open = ref(false);

const val = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        return emit("update:modelValue", val);
    },
});
const selectDate = ref(!props.timeOnly);
const popup = ref(null);
const formatted = computed(() => {
    if (!props.modelValue) return "Select a time";
    const { format } = useTime();
    return format(props.modelValue, "MMM D, YYYY [at] h:mm A");
});

const save = () => {
    popup.value.hide();
    emit("update:modelValue", date.value);
};

const selectedMinute = ref(false);

const onSelectTime = (value: string | null, details: object) => {
    date.value = value;
    if (!selectedMinute.value) selectedMinute.value = true;
};

const onHide = () => {
    selectDate.value = !props.timeOnly;
    selectedMinute.value = false;
};

const onSelectDate = (val) => {
    date.value = val;
    if (props.dateOnly) return; 
    selectDate.value = false;
};

const emit = defineEmits(["update:modelValue"]);
</script>
