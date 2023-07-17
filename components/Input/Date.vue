<template>
    <q-input rounded outlined v-model="date" mask="date" :rules="['date']" :name="name" :label="name">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
</template>

<script setup lang="ts">
import {ref} from 'vue'
    const props = defineProps({
        modelValue: String,
        name: String,

    })
    const emit = defineEmits(['update:modelValue'])
    const date = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
</script>