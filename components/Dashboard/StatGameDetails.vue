<template>
    <GlobalMenu v-model="showGameInfo" :closeOnOutsideClick="false">
        <DashboardLineChartGameInfo
                    :data="data"
                    :type="type"
                    :gameId="gameId"
                    v-if="gameId"
                />
       
    </GlobalMenu>
</template>
<script setup>
import {STAT_COLORS} from '@/constants/stats'
const props = defineProps({
    modelValue: Boolean,
    data: Object,
    type: String,
});

const gameId = computed(() => props.data?.game_id);

const emit = defineEmits(["update:modelValue"]);

const {getColor} = useColor();

const showGameInfo = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const show = ref(false)
onMounted(() => {
    show.value = true;
})
</script>
