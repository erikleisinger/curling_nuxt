<template>
    <div class="location-container row no-wrap" >
        <!-- @click="navigateTo(`/rinks/${team.rink.id}`)" -->

       <CountryCa class="country"/>

        <div class="relative-position">
             <div class="province">
            <ProvinceOn v-if="teamProvince === 'ON'" height="100%" class="on" />
        </div>
        </div>
        <div class="location-header row items-center">
            <div class="location-header__control">
                <!-- <div class="row no-wrap">
                    <q-icon name="location_on" color="red" />
                    <h3>{{ team?.rink?.name }}</h3>
                </div> -->
                <h3>{{ team.rink?.city }}</h3>
                <h4>ONtario</h4>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.location-container {
    // background-color: $app-slate;
    display: grid;
    width: fit-content;
    grid-template-columns: 33% 1fr;
    color: white;
    min-width: 150px;
    // border-radius: 12px;
    
    // aspect-ratio: 3/2;
    // max-width: 200px!important;

    box-sizing: border-box;
    // padding: var(--space-md);
    // @include chunky-border(6px);
    position: relative;
    .country {
        position: absolute;
       
        left: 0;
        right: 0;
        margin: auto;
        border-radius: 50%;
        width: fit-content;
        overflow: hidden;
        box-shadow: $pretty-shadow;

        aspect-ratio: 1/1;
        height: 40px;
        top: -35px;
        z-index: 1;
        @include sm {
            height: 50px;
             top: -40px;
        }

    }
    .province {
        position: absolute;
        min-width: 50px;
       margin-right: var(--space-sm);
        fill: $app-blue;
        z-index: 0;
        top: 0;
        bottom: 0;
        left: 25%;
       
        svg {
            
            path {
            stroke: none;
                fill: rgb(22, 27, 38, 0.4);
            }
        }
        .on {
            transform: scale(1.2)
        }
    }
    .location-header {
        z-index: 1;
        padding: var(--space-sm) 0px;
        h3 {
            @include md-text;
        }
        h4 {
            @include reg-text;
            // margin-left: 1em;
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
