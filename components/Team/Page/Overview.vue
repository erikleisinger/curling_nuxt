<template>
<div class="team-overview__container">
 <div class="full-width row justify-center" style="margin-top: 30px">
                <TeamPageLocation :teamId="teamId" />
                
            </div>
            <div class="text-center text-caption text-white">Royal Canadian Curling Club</div>

        <div class="about">
            <h2>About</h2>
            <p>Hailing from the windy shores of the nation’s forest, team Gronky Gronky Garner looks to diversify your portfolio, maximizing per capita spending power by a margin of 6 / 1, overhead including Fortune 500 mutual funding bull market etc.</p>
        </div>
</div>
</template>
<style lang="scss" scoped>
.team-overview__container {
    color: $app-slate;
  .about {
        width: 100%;
        // padding: 0px var(--space-md);
        // margin-top: var(--space-md);
        color:  white;
        p {
            font-weight: 300;
            font-size: 0.9rem;
            line-height: 1.1;
            padding: unset;
            margin: unset;
        }
    }
}
  
</style>
<script setup>
    const props = defineProps({
        teamId: Number
    })
</script>