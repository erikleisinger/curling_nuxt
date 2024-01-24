<template>

     <q-input
                    name="password"
                    label="Password"
                    type="password"
                    v-model="password"
                    :rules="[
                        VALIDATION_RULES.REQUIRED,
                        VALIDATION_RULES.MIN_LENGTH(6),
                    ]"
                    lazy-rules
                    standout
                    ref="passwordRef"
                    dark
                    filled
                />
                <q-input
                    name="password verification"
                    label="Verify your password"
                    type="password"
                    v-model="passwordCheck"
                    :rules="[
                        VALIDATION_RULES.REQUIRED,
                        VALIDATION_RULES.MIN_LENGTH(6),
                        validatePassword,
                    ]"
                    lazy-rules
                    standout
                    outlined
                    dark
                    filled
                />

</template>
<script setup>
    import {VALIDATION_RULES} from '@/constants/validation'
    const validatePassword = (val) => {
    return val === password.value || "Passwords do not match";
};

    const props = defineProps({
        modelValue: String,
    })

    const emit = defineEmits([
        'update:modelValue'
    ])

    const password = computed({
        get() {
            return props.modelValue
        },
        set(val) {
            emit('update:modelValue', val)
        }
    })
    const passwordCheck = ref(null);
    const passwordRef = ref(null)
</script>