<template>
    <q-input rounded outlined v-model="date" mask="date" :rules="['date']" :name="name" :label="name">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time v-model="time">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
              </div>
            </q-time>
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
    const time = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
</script>