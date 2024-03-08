<template>
    <div class="dashboard__container" id="dashboard">
          
        <main class="main-content" ref="mainContent" id="dashboard-scroller">
                 <!-- <nav>
         <q-tabs
        
            class="tabs"
            ref="tabs"
                v-model="tab"
            outside-arrows
            shrink
        >
            <q-tab label="Stats" :name="0" :ripple="false" />

            <q-tab label="Leaderboard" :name="1" :ripple="false" />
        </q-tabs>
        </nav> -->
           <DashboardStats v-if="tab === 0"/>
           <DashboardLeaderboard v-else-if="tab === 1"/>
        </main>
    </div>
</template>
<style lang="scss" scoped>
.tabs {
    @include tabs($app-mint);
    
}
.dashboard__container {
    @include bg-blue-side;
        min-height: 100%;
    color: rgb(250, 250, 250);
    position: relative;
    width: 100%;
    .main-content {
        @include hide-scroll;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
    }

}
</style>
<script setup>
const tab = ref(0)
</script>
