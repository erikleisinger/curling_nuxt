<template>
<div>
<div style="position:relative">
    <div style="position: absolute; width: 100%; top: -16px" class="row justify-center">
        <div style="position: relative; width: 145px">
            <div
                style="position:absolute;"
                class="shadow-box"
            ></div>
        </div>
    </div>
      <div
        class="game-item__container"
        :class="{ selected }"

    >
        <q-item-section style="position: relative">
            <div class="game-info__container">
                <div class="game-info">
                    <slot name="label">
                    
                    </slot>
                </div>
            </div>
       <slot/>
        </q-item-section>
    </div>
    </div>
    </div>
</template>
<style lang="scss">
.game-item__container {
    border-radius: 16px;
    background-color: white;
    // box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    padding: 16px;
    transition: all 0.2s;
    position: relative;
    &.selected {
        transform: scale(1.02);
    }
    
    .score-display {
        width: 100%;
        display: grid;
        grid-template-rows: 1fr auto;
        // grid-template-columns: calc(33% - 32px) 33% calc(33% - 32px);
        grid-template-columns: minmax(0, 1fr) 50px 3em 50px minmax(0, 1fr);
        row-gap: 16px;

        .percent-container {
            grid-column: span 2;
            transition: all 1s;
            overflow: hidden;
        }
    }
     .game-info__container {
        height: 24px;
        position: relative;
        .game-info {
            width: 145px;
            margin: auto;
            position: absolute;
            right: 0;
            left: 0;
            top: -32px;
            background-color: white;
            border-radius: 50px;
            padding: 15px;
            font-size: 0.9em;
            padding-bottom: 0;
            position: relative;
            min-height: 40px;
        }
    }
}
   .shadow-box {
            height:15px;
             width: 120px;
            margin: auto;
            position: absolute;
            right: 0;
            left: 0;
            background-color: white;
            border-radius: 50px;
            font-size: 0.9em;
            padding-bottom: 0;
            position: relative;
            top:0px;
            &:after {
                content: "";
                position: absolute;
                z-index: -2;
                height: 100%;
                width: 100%;
                border-radius: inherit;
             box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
                top: 0;
                left: 0;

            }  
        }
</style>
<script setup>
    const props = defineProps({
        selected:Boolean,
    })
</script>