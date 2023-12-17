<template>
<div class="row full-width">
    <q-rating
        v-model="ratingModel"
        size="3em"
        icon="stars"
        color="grey"
        :color-selected="ratingColors"
        :max="4"
        class="justify-around col-grow"
        :icon-aria-label="['terrible', 'bad', 'mediocre', 'fair', 'good']"
      ></q-rating>
     <label class="q-mt-sm"  style="min-height:calc(1em + 8px); width: 100%"><span v-if="showLabel">{{label}}</span></label>
      </div>
</template>
<script setup>

const props = defineProps({
    modelValue: [Number, null],
    showLabel: {
        type: Boolean,
        default() {
            return true;
        }
    }
})

const emit = defineEmits(['update:modelValue'])

    const ratingModel = computed({
        get() {
            return props.modelValue
        },
        set(val) {
            emit('update:modelValue', val)
        }
    })
    const ratingColors = [ 'blue-5', 'blue-5', 'blue-5', 'blue-5',   ]
    const label = computed(() => {
        if (ratingModel.value == null) return ''
        return {
            0: 'Terrible (did not improve the situation)',
            1: 'Bad (slightly improved situation)',
            2: 'Mediocre (not desired outcome)',
            3: 'Fair (almost the desired outcome)',
            4: 'Good (achieved desired outcome)',
        }[ratingModel.value]
    })

    const color = computed(() => {
        if (ratingModel.value === null) return 'grey';
        return ratingColors[ratingModel.value]
    })
</script>