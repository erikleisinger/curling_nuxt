<script setup>
import { Variant } from "@vitebook/vue";
const percent = ref(50)
const label = ref('Label')
const color = ref('yellow')
function onEnterVariant(variant) {
  console.log('enter: ', variant)
}

function onExitVariant(variant) {
   console.log('exit: ', variant)
}
</script>

<template>
<div style="position:absolute; top: 0">
    <select v-model="color">
         <option value="yellow">Yellow</option>
    <option value="red">Red</option>
    <option value="blue">Blue</option>
    </select>
    <input type="number" v-model="percent"/>
    <input v-model="label"/>
</div>
    <div style="width: 500px">
        <Variant
            name="Default"
            description="The default percentage."
            @enter="onEnterVariant"
            @exit="onExitVariant"
        >
            <percentage :color="color" :percent="percent" :label="label" />
        </Variant>
        <Variant name="Reverse" description="The default percentage.">
            <percentage :color="color" :percent="percent" reverse :label="label" />
        </Variant>
    </div>
</template>
