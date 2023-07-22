<template>
<div class="input__wrapper row justify-center items-center">
      <div class="option__center row justify-center items-center" :class="{selected: selected === 0}" @click="select(0)"><div>Draw</div></div>
    <div class="input__container pretty-shadow" :style="{height: props.active ? '100%' : '50%', width: props.active ? '100%' : '50%'}">

        <div class="option "  style="order: 1" :class="{selected: selected === 1}" @click="select(1)"><div>Front</div></div>
        <div class="option" style="order:2" :class="{selected: selected === 2}" @click="select(2)"><div>Guard</div></div>
           
        <div class="option"  style="order:4" :class="{selected: selected === 3}" @click="select(3)"><div>Freeze</div></div>
        <div class="option"  style="order:3" :class="{selected: selected === 4}" @click="select(4)"><div>Tap</div></div>
              
      
         
        <div class="center__blind"/>
      
             <div class="color__dial" :class="{grow: selected !== 0, shrink: selected === 0 || selected === null}">
                <div class="color__dial--position"/>
             </div>
    
    </div>
    </div>
</template>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap");
.input__wrapper {
    position: relative;
   
     height: 150px;
    width: 150px;
 .option__center {
        height: 50%;
        width: 50%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 0;
        background-color: inherit;
        border-color:inherit;
        border-radius: 50%;
        border: 1px solid;
        border-color:rgba(0,0,0,0.1);
        z-index: 5;
        color: rgb(82, 94, 255);;
        &.selected {
            color: white;
            font-weight: bold;
            background-color: rgb(82, 94, 255);;;
        }
    }
.input__container {
    font-family: "Montserrat", sans-serif;
    display: grid;
    position: absolute;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    background-color:white;
    position: relative;
    border-radius: 50%;
    border-color: rgba(0, 0, 0, 0.1)!important;
    border: 1px solid;
    overflow:hidden;
    z-index:0;
    transform: all 0.3s linear;
    .option {
        z-index: 2;
        border: 0px solid;
        border-color: inherit;
        color: rgb(82, 94, 255);
        font-size: 75%;
        display: flex;
        justify-content: center;
        align-items: center;
        >div {
    
           text-align: center;
            mix-blend-mode: difference;
        }
        &:nth-child(1) {
            border-right-width: 1px;

        }
        &:nth-child(2) {
            border-bottom-width: 1px;
   
        }
        &:nth-child(3) {
            border-left-width: 1px;

        }
        &:nth-child(4) {
            border-top-width: 1px;
        }
        &.selected {
            color: white;
            font-weight: bold;
        }
    }
   

    .color__dial {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 0;
        background-color: white;
        border: 0px solid;
        border-radius: 50%;
        z-index:-5;
      
        border-radius: 50%;
        overflow:hidden;
        &.grow {
            animation: 0.1s grow linear forwards;
        }
        &.shrink {
            animation: 0.1s shrink linear forwards;
        }
        .color__dial--position {
            height:50%;
            width:50%;
            background-color: rgb(82, 94, 255);
            transform-origin: bottom right;
            transform: v-bind(rotation);
            // transition: transform 0.3s;
        }
    }
    .center__blind {
        height: 50%;
        width: 50%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 0;
        background-color: white;
        border-radius: 50%;
        z-index:2
    }

    .option__center {
        &.selected {
             &:nth-child(1) {
            border-left-width: 3px;
        }
        &:nth-child(2) {
            border-bottom-width: 1px;
        }
        &:nth-child(4) {
            border-top-width: 1px;
        }
        &:nth-child(5) {
            border-left-width: 1px;
        }
        }
    }
}
}
@keyframes grow {
    0% {
        height:50%;
        width:50%;
    }
    100% {
        height: 100%;
        width: 100%;
    }
}
@keyframes shrink {
     0% {
        height: 100%;
        width: 100%;
    }
    100% {
        height:50%;
        width:50%;
    }
   
}
</style>
<script setup>

const props = defineProps({
    active: Boolean,
})

const rotation_key = {
            1: 0,
            2: 90,
            3: 180,
            4: 270,
        }

    const selected = ref(null)
    const lastSelected = ref(null);

    const hideWheel = computed(() => selected.value === 0 ? 'none' : 'block')

    const degrees = ref(0);

    watch(selected, (val) => {
        const last = lastSelected.value;
lastSelected.value = val;
if (val === 0) return;

        if (!last) {
            degrees.value = rotation_key[val];
            return;
        }
        if (val > last) {
            console.log(rotation_key[val], rotation_key[last], rotation_key[val] - rotation_key[last])
            degrees.value += rotation_key[val] - rotation_key[last];
        }
        if (val < last) {
             console.log(rotation_key[last], rotation_key[val], rotation_key[last] - rotation_key[val])
             degrees.value -= rotation_key[last] - rotation_key[val];
        }
     
//         } else if (val < lastSelected.value) {
// degrees -= rotation_key[val] - rotation_key[lastSelected.value];
//         }

    }, {flush: 'pre'})
    const rotation = computed(() => `rotate(${degrees.value}deg)`)
    // const rotation = computed(() => {
    //     return {
    //         0: '',
    //         1: 'rotate(0deg)',
    //         2: 'rotate(90deg)',
    //         3: 'rotate(180deg)',
    //         4: 'rotate(270deg)',
    //     }[selected.value]
    // })

    const select = (num) => {
        if (selected.value === num) {
            selected.value = null;
        } else {
            selected.value = num
        }
    }
</script>
