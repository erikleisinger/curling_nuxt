<template>
    <div>
       <q-input v-if="type === 'text'" :name="name" v-model="inputValue" :label="input.displayName"/>
       <EditorInputDate v-if="type ==='date'" :name="name" :item="input"/>
      <EditorInputSelect v-if="type === 'select'" :item="input" :name="name" requi/>
    </div>
</template>

<script setup>
import {computed, ref} from 'vue'
    const props = defineProps({
        input: Object,
        name: String,
    })

    const inputValue = ref(null)
    const type = computed(() => props?.input?.type || '')
</script>   