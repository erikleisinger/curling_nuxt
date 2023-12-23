<template>
     <q-select
                    :options="COLOR_OPTIONS"
                    v-model="color"
                    dense
                    outlined
                    :label="label"
                    :placeholder="placeholder"
                    behavior="menu"
                    emit-value
                    required
                >
                    <template v-slot:prepend>
                        <q-icon name="circle" :style="{ color }" />
                    </template>
                    <template v-slot:selected>
                        {{
                            COLOR_OPTIONS.find(({ value }) => value === color)
                                ?.label
                        }}
                    </template>
                    <template v-slot:option="{ opt, itemProps }">
                        <q-item clickable v-ripple v-bind="itemProps">
                            <q-item-section avatar>
                                <q-icon
                                    name="circle"
                                    :style="{ color: opt.value }"
                                />
                            </q-item-section>
                            <q-item-section>
                                {{ opt.label }}
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>
</template>
<script setup>
    import {COLOR_OPTIONS } from '@/constants/color'

    const props = defineProps({
        modelValue: String,
        label: String,
        placeholder: String,
    })

    const emit = defineEmits(['update:modelValue'])

    const color = computed({
        get() {
            return props.modelValue
        },
        set(val) {
            emit('update:modelValue', val)
        }
    })
</script>