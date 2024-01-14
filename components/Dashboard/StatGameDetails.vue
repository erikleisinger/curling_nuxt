<template>
    <GlobalMenu v-model="showGameInfo" :closeOnOutsideClick="false">
        <DialogCard maxWidth="95vw" minWidth="200px" :titleColor="getColor(STAT_COLORS[type])">
            <template v-slot:title>
                {{ props.data?.points_for }}-{{ props.data?.points_against }}
                {{ props.data?.win ? "win" : props.data?.tie ? "tie" : "loss" }}
            </template>

            <template v-slot:content>
                <DashboardLineChartGameInfo
                    :data="data"
                    :type="type"
                    :gameId="gameId"
                    v-if="gameId"
                />
            </template>
        </DialogCard>
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
</script>
