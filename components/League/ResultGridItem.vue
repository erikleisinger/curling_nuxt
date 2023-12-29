<template>
<div v-if="!result" class="blank"/>
    <div v-else-if="teamOnePoints === teamTwoPoints">-</div>

    <div class="row no-wrap justify-center items-center full-height" v-else>
        <div style="width: 25px" v-if="teamOnePoints !== teamTwoPoints">
            <TeamAvatar
                :teamId="
                    teamOnePoints > teamTwoPoints
                        ? Number(Object.keys(props.result)[0])
                        : Number(Object.keys(props.result)[1])
                "
            />
        </div>
        <div class="text-xs q-ml-xs">
            +{{ Math.abs(teamOnePoints - teamTwoPoints) }}
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .blank {
        background-color: rgba(0,0,0,0.2);
        height: 100%;
        width: 100%;
    }
</style>
<script setup>
const props = defineProps({
    result: Object,
});

const teamOnePoints = computed(() => Object.values(props.result)[0]);
const teamTwoPoints = computed(() => Object.values(props.result)[1]);
</script>
