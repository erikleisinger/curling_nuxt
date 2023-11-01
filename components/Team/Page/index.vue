<template>
    <TeamPageHeader :teamId="Number(route.params.id)"/>
</template>
<script setup lang="ts">
    const route = useRoute();
</script>