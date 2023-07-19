<template>
    <q-input rounded outlined v-model="val" readonly :name="name" :label="name">
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    v-model="showDate"
                >
                    <q-date
                        v-model="date"
                        @update:model-value="selectDate(date)"
                    />
                </q-popup-proxy>
            </q-icon>
        </template>
        <q-popup-proxy
            cover
            transition-show="scale"
            transition-hide="scale"
            v-model="showTime"
        >
            <q-time v-model="time" @update:model-value="selectTime" />
        </q-popup-proxy>
    </q-input>
</template>

<script setup lang="ts">
import { ref } from "vue";
const props = defineProps({
    modelValue: String,
    name: String,
});

const val = computed({
    get() {
        if (props.modelValue) {
            const split = props.modelValue.split(" ");
            return `${split[0]} ${split[1]}`;
        }
        return null;
    },
    set(val) {
        return `${dateTime.value.date} ${dateTime.value.time}`;
    },
});
const emit = defineEmits(["update:modelValue"]);
const dateTime = computed(() => ({ time: time.value, date: date.value }));
const time = ref("");
const date = ref("");
const showTime = ref(false);
const showDate = ref(false);
const selectDate = (d: string) => {
    showDate.value = false;
    showTime.value = true;
   
    nextTick(() => {
          date.value = d;
    })
   
};
const selectTime = () => {
    showTime.value = false;
};
onMounted(() => {
    if (props.modelValue) {
        const split = props.modelValue.split(" ");
        date.value = split[0];
        time.value = split[1];
    }
    return null;
});
watch(
    dateTime,
    ({ time, date }) => {
        emit("update:modelValue", `${date} ${time}`);
    },
    { deep: true }
);
</script>
