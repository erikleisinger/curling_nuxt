<template>
<div class="row title"> 
    <IconEnd :cols="cols" width="60" color="white" :style="endsRemaining === -1 ? 'margin-right: var(--space-sm)' : ''" />
    <h2 class="smmd-text">{{name}}</h2>

</div>
    <DashboardStatDetailsItemTemplate :color="getColor('mint')">
      
        <template v-slot:title> with hammer </template>
        <template v-slot:subtitle>
            {{
                stats.byEnd({
                        endsRemaining,
                        hammer: true,
                    }).count
            }}/{{
                stats.byEnd({
                        endsRemaining,
                        hammer: true,
                    }).totalCount
            }} games
        </template>
        <template v-slot:value>
            <DashboardStatValue
                :value="
                    stats.byEnd({
                        endsRemaining,
                        hammer: true,
                    }).value
                "
                isPercent
            />
        </template>

        <template v-slot:more v-if="endsRemaining !== -1">
            <DashboardStatDetailsItemTemplate v-for="diff in diffs" :key="diff">
                <template v-slot:title> {{diffNames[diff]}} </template>
                 <template v-slot:subtitle>
            {{
                stats.byEnd({
                        endsRemaining,
                        hammer: true,
                        diff,
                    }).count
            }}/{{
                stats.byEnd({
                        endsRemaining,
                        hammer: true,
                        diff
                    }).totalCount
            }} games
        </template>
                <template v-slot:value>
                    <DashboardStatValue
                        isPercent
                        :value="
                            stats.byEnd({
                                endsRemaining,
                                diff,
                                hammer: true,
                            }).value
                        "
                    />
                </template>
            </DashboardStatDetailsItemTemplate>

        </template>
    </DashboardStatDetailsItemTemplate>

      <DashboardStatDetailsItemTemplate :color="getColor('red')">
     
        <template v-slot:title> without hammer </template>
        <template v-slot:subtitle>
            {{stats.byEnd({
                        endsRemaining,
                        hammer: false,
                    }).count}}/{{stats.byEnd({
                        endsRemaining,
                        hammer: false,
                    }).totalCount}} games
        </template>
        <template v-slot:value>
            <DashboardStatValue
                :value="
                    stats.byEnd({
                        endsRemaining,
                        hammer: false,
                    }).value
                "
                isPercent
            />
        </template>

        <template v-slot:more v-if="endsRemaining !== -1">
            <DashboardStatDetailsItemTemplate v-for="diff in diffs" :key="diff">
                <template v-slot:title> {{diffNames[diff]}} </template>
                 <template v-slot:subtitle>
            {{
                stats.byEnd({
                        endsRemaining,
                        hammer: false,
                        diff,
                    }).count
            }}/{{
                stats.byEnd({
                        endsRemaining,
                        hammer: false,
                        diff
                    }).totalCount
            }} games
        </template>
                <template v-slot:value>
                    <DashboardStatValue
                        isPercent
                        :value="
                            stats.byEnd({
                                endsRemaining,
                                diff,
                                hammer: false,
                            }).value
                        "
                    />
                </template>
            </DashboardStatDetailsItemTemplate>
        </template>
    </DashboardStatDetailsItemTemplate>
</template>
<style lang="scss" scoped>
    .title {
        margin-bottom: var(--space-sm);
    }
</style>    
<script setup>
const props = defineProps({
    endsRemaining: Number,
    stats: Object,
});

const {getColor} = useColor();

const name = {
    [-1]: 'Extra end',
    0: 'Last end',
    1: '2nd-last end',
    2: '3rd-last end'

}[props.endsRemaining]

const cols = {
    [-1]: 4,
    0: 3,
    1: 2,
    2: 1
}[props.endsRemaining]

const diffs =[
    2,
    1,
    0,
    -1,
    -2
]

const diffNames = {
    [-2]: 'Down 2+ points',
    [-1]: 'Down 1 point',
    0: 'Tied',
    1: 'Up 1 point',
    2: 'Up 2+ points'
}




</script>
