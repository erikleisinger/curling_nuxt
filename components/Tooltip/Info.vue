<template>
    <q-btn color="primary" @click="showing = true" flat round icon="help_outline"></q-btn>
     <q-tooltip v-model="showing">Tooltip text</q-tooltip>
</template>
<script setup>
    const showing = ref(false);
</script>