<template>
    <q-btn-group push outline spread>
        <q-btn v-for="table,index in VISIBLE_TABLES" :key="index" :label="table" @click="setSelection(table)"  color="purple" :outline="!isSelected(table)" :disabled="loading"/>  
        <!-- :text-color="textColor(table)" :color="buttonColor(table)"  -->
    </q-btn-group>
</template>

<script setup>
    import { computed, ref } from 'vue'
    import { VISIBLE_TABLES } from '@/constants/tables'


    const props = defineProps(['modelValue', 'loading'])
    const emit = defineEmits(['update:modelValue'])


    const selection = computed({
        get() {
            return props.modelValue
        },
        set(value) {
            emit('update:modelValue', value)
        }
    })
        const buttonColor = (table) => {
        return isSelected(table) ? 'primary' : 'white'
    }
    const setSelection = (name) => {
        selection.value = name;
    }
    const isSelected = (table) => {
        return table === selection.value
    }
    const textColor = (table) => {
        return isSelected(table) ? 'white' : 'black'
    }
</script>

