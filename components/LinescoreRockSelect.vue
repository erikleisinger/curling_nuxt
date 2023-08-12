<template>
    <div class="rockinput-container">
        <div class="scoreboard__end-row ">
        <div class="selection__container">
             <div class="color-select__wrap">
             <SelectColor/>
             </div>
              <div class="team-name">
                Name
            </div>
             </div>
        </div>
        <div class="scoreboard__end-row ">
            <div class="selection__container">
                <div class="color-select__wrap">
             <SelectColor/>
             </div>
            <div class="team-name">
                Name
            </div>
               </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$width: 100vw;
.rockinput-container {
    scroll-snap-align: center;
    scroll-snap-stop: always;
    overflow: hidden;
    display: grid;
    min-width: $width;
    max-width: $width;
    grid-template-columns: 100%;
    grid-template-rows: repeat(2, 50%);
    row-gap: 1px;
    height: 100%;
    width: 100%;
    padding: var(--space-lg);
    .scoreboard__end-row {
        width: 100%;

       display: flex;
 
       align-items: center;
       .color-select__wrap {
        display: flex;
        justify-content: center;
        align-items: center;
 .rock__icon {
        width: 10vh;
        max-width: 16vh;
       }
       }
      
       .selection__container {
        display: grid;
        grid-template-columns: min-content  1fr;
        width: 100%;
        .team-name {
display: flex;
align-items: center;
padding-left: var(--space-sm);
font-size: var(--text-lg);
        }
       }
    
    }
}
</style>
<script setup>
const emit = defineEmits(["update:model-value", "visible"]);

// const props = 
</script>
