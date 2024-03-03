<template>
    <GlobalMenu v-model="showGameInfo">
      
        <DashboardLineChartGameInfo
                    :data="data"
                    :type="type"
                    :gameId="gameId"
                    v-if="gameId"
                    :comparisonType="comparisonType"
                />
       
    </GlobalMenu>
</template>
<script setup>
import {STAT_COLORS} from '@/constants/stats'
const props = defineProps({
    comparisonType: String,
    modelValue: Boolean,
    data: Object,
    type: String,
});

const gameId = computed(() => props.data?.game_id);

const emit = defineEmits(["update:modelValue", 'close']);

const {getColor} = useColor();

const showGameInfo = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

</script>
