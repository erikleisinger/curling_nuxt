<template>
<div style="position: relative">
    <span class="diff q-mr-sm" v-if="diff !== null && diff !== undefined">
         <q-icon
                v-if="diff"
                :name="diff > 0 ? 'arrow_drop_up' : 'arrow_drop_down'"
                
                :style="{
                    color: dark ? 'white' : diff > 0 ? getColor('mint') : getColor('red'),
                }"
            />
           <span v-if="diff"> {{Math.abs(diff).toFixed(isPercent ? 0 : 1)}}{{isPercent ? '%' : ''}}</span>
           <span v-else-if="typeof value === 'number'">-</span>
    </span>
    <span>{{value}}</span>
    <span
        class="text-caption"
       
        v-if="isPercent && typeof value === 'number'"
        >%</span
    >
</div>
</template>
<style lang="scss" scoped>
    .diff {
        font-size: 0.4em;
        font-family: $font-family-secondary;
        color: rgba(255,255,255,0.8)
    }
</style>    
<script setup>
const props = defineProps({
    dark: Boolean,
    diff: {
        type: Number,
        default: null
    },
    isPercent: Boolean,
    value: [Number, null, String]
});

const {getColor} = useColor();

</script>
