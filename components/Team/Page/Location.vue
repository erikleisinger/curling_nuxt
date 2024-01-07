<template>
    <div class="location-container row no-wrap" >
        <!-- @click="navigateTo(`/rinks/${team.rink.id}`)" -->
        <div class="province">
            <ProvinceOn v-if="teamProvince === 'ON'" height="100%" />
        </div>
        <div></div>
        <div class="location-header row items-center">
            <div class="location-header__control">
                <div class="row no-wrap">
                    <q-icon name="location_on" color="red" />
                    <h3>{{ team?.rink?.name }}</h3>
                </div>
                <h4>{{ team.rink?.city }}, {{ team.rink?.province }}</h4>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.location-container {
    // background-color: $app-slate;
    @include bg-slate-diagonal;

    border-radius: 12px;
    color: white;
    
    // aspect-ratio: 3/2;
    // max-width: 200px!important;
    box-shadow: $pretty-shadow;
    box-sizing: border-box;
    padding: var(--space-md);
    @include chunky-border(6px);
    position: relative;
    display: grid;
    grid-template-columns: 75px 1fr;
    .province {
        position: absolute;
        min-width: 50px;
       margin-right: var(--space-sm);
        fill: $app-blue;
        z-index: 0;
        top: 0;
        bottom: 0;
        left: var(--space-sm);
       
        svg {
            
            path {
            stroke: none;
                fill: rgb(22, 27, 38, 0.8);
            }
        }
    }
    .location-header {
        z-index: 1;
        h3 {
            @include smmd-text;
        }
        h4 {
            @include reg-text;
            margin-left: 1em;
        }
        .location-header__control {
            // margin-top: var(--space-md);
        }
    }
}
</style>
<script setup>
import Team from "@/store/models/team";
const props = defineProps({
    teamId: Number,
});

const team = computed(() =>
    useRepo(Team).withAllRecursive().where("id", props.teamId).first()
);
const teamProvince = computed(() => team.value.rink?.province);
</script>
