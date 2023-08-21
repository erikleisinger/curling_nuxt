<template>
    <div class="full-height full-width column time__select row justify-center items-center">
                <div class="time-select__container" >    
        <!-- <InputDate label="Click to enter a date and time" v-model="date"/> -->
         <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
                ref="popup"
                @hide="onHide"
            >
                <q-date
                    v-model="date"
                    mask="YYYY-MM-DD"
                    @update:model-value="() => popup.hide()"
                />
         </q-popup-proxy>
        <div class="date full-height full-width row justify-center items-center">
           <div style="height: fit-content"> {{formattedDate}}</div>
        </div>
        <div class="text-center full-width text-md row items-center justify-center">{{formattedMonth}}</div>
                </div>
        <!-- <SelectRink/> -->
    </div>
</template>
<style lang="scss" scoped>
$date-container-dimension: 8em;
$date-container-bottom-height: 3em;
.time__select {
    padding: var(--space-md);
    .q-btn {
        margin-bottom: var(--space-md);
    }
    .time-select__container {
        height: $date-container-dimension;
        // width: $date-container-dimension;
        aspect-ratio: 1/1;
        border: 1px solid $grey-3;
        box-shadow: $pretty-shadow;
        border-radius: 16px;
        display: grid;
        grid-template-rows: 1fr $date-container-bottom-height;
        .date {
            padding-top: 0.3em;
            font-size: calc(($date-container-dimension) - $date-container-bottom-height);
            line-height: 0;
        }
    }
}
</style>

<script setup>
const props = defineProps({
    modelValue: Number,
});

const dayjs = useDayjs();
const date = ref(dayjs().format('YYYY-MM-DD'))
const popup = ref(null)


const formattedDate = computed(() => dayjs(date.value).get('date'))
const formattedMonth = computed(() => dayjs(date.value).format('MMM'))

const emit = defineEmits(["select", "update:modelValue"]);

const selection = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const onSelect = (num) => {
    emit('select')
    selection.value = num
}
</script>
