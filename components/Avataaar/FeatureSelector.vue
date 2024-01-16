<template>
      <q-select :options="options" behavior="menu" v-model="feature" class="feature-select" >
       
        <template v-slot:selected-item="{opt}">
          
            {{labels[opt] ?? opt}}
              
        </template>
        <template v-slot:option="{opt, itemProps}">
            <q-item clickable v-ripple v-bind="itemProps">
                <q-item-section avatar v-if="opt.icon">
                    <q-icon :name="opt.icon" :style="{color: opt.color}" dense />
                </q-item-section>
                <q-item-section>
                    {{opt.label}}
                </q-item-section>
            </q-item>
        </template>
      </q-select>
</template>
<script setup>
const props = defineProps({
    disabled: Boolean,
    features: Object,
    modelValue: String,
    title: String,
});

const emit = defineEmits(["update:modelValue"]);

const feature = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val.value);
    },
});


const labels = {
    
}

const isColorOpt = (str) => {
    return str.charAt(0) === '#'
}

const {sortAlphabetically} = useSort();
const options = Object.entries(props.features).map(([label, value]) => ({
    label: labels[label] ?? label,
    value: label,
    icon: isColorOpt(value) ? 'circle' : '',
    color: value,
})).sort((a,b) => sortAlphabetically(a.label, b.label))
</script>
