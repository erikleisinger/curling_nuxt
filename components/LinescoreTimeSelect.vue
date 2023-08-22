<template>
<h1 class="text-md text-bold title">Select a time</h1>
    <div
        class=" full-width  time__select row justify-around items-center"
    >
        <div class="date-select__container">
            <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
                ref="popup"
            >
                <q-date
                    v-model="date"
                    mask="YYYY-MM-DD"
                    @update:model-value="() => popup.hide()"
                />
            </q-popup-proxy>
            <div
                class="date full-height full-width row justify-center items-center"
            >
                <div style="height: fit-content">{{ formattedDate }}</div>
            </div>
            <div
                class="text-center full-width text-sm row items-center justify-center"
            >
                {{ formattedMonth }}
            </div>
        </div>

        <div class="time-select__container">
            <div>
                <input class="time__input" v-model="hour" type="number" max="12" />
            </div>
            <div  class="text-center colon">:</div>
            <div>
                <input class="time__input" v-model="minute" />
            </div>
            <div class="ampm">
                <div
                    :class="{ selected: ampm === 'am' }"
                    @click="ampm = 'am'"
                    class="ampm__button"
                >
                    AM
                </div>
                <div
                    :class="{ selected: ampm === 'pm' }"
                    @click="ampm = 'pm'"
                    class="ampm__button"
                >
                    PM
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$date-container-dimension: 5em;
$date-container-bottom-height: $date-container-dimension / 4;
.title {
    margin: 0px var(--space-md);
    margin-top: var(--space-sm);
}
.time__select {
    padding: var(--space-sm);
    .q-btn {
        margin-bottom: var(--space-md);
    }
    .date-select__container {
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
            font-size: calc(
                ($date-container-dimension) - $date-container-bottom-height
            );
            line-height: 0;
        }
    }
    .time-select__container {
        display: grid;
        grid-template-columns: auto 1ch auto auto;
        background-color: white;
        border-radius: 16px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: $pretty-shadow;
        padding-left: var(--space-sm);
        overflow: hidden;
        height: 100px;
      
        div {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .ampm {
            display: grid;
            grid-template-rows: repeat(2, 1fr);
            margin-left: var(--space-sm);
        
            .ampm__button {
                height:100%;
                width: 100%;
                padding-left: var(--space-sm);
                   padding-right: var(--space-sm);
                      transition: all 0.2s;
                &.selected {
                    background-color: $deep-purple;
                    color: white;
                }
            }
        }
        .time__input {
            background-color: transparent;
            border: 0px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);

            width: 2.3ch;
            font-size: 2em;
            margin-bottom: var(--space-xxxs);
             margin-top: var(--space-xxxs);
            &:focus {
                outline: none;
            }
        }
        .colon {
            font-size: 2em;
             margin-bottom: var(--space-xxxs);
               margin-top: var(--space-xxxxs);
        }
    }
}
</style>

<script setup>
const props = defineProps({
    modelValue: String,
});

const dayjs = useDayjs();

onMounted(() => {
    const time = dayjs(props.modelValue, 'YYYY MM DD hh mm a')
    minute.value = time.minute();
    hour.value = time.format('hh')
    date.value = time.format('YYYY-MM-DD')
    ampm.value = time.format('a')
})


const date = ref(dayjs().format("YYYY-MM-DD"));
const popup = ref(null);

const formattedDate = computed(() => dayjs(date.value).get("date"));
const formattedMonth = computed(() => dayjs(date.value).format("MMM"));

const emit = defineEmits(["selection", "update:modelValue"]);

const ampm = ref("am");
const minute = ref('00');
const hour = ref('12');


const formatted = computed(() => `${date.value} ${hour.value}:${minute.value} ${ampm.value}`)

watch(formatted, (val) => {
    const utc  = dayjs(val)
    emit('update:modelValue', utc.tz("America/Toronto", true).format('YYYY MM DD hh mm a'))
})

</script>
