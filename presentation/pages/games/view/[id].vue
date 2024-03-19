<template>
<GamePage :gameId="gameId"/>
</template>
<script setup>
const route = useRoute();
const gameId = Number(route.params.id);
</script>
<script>
export default {
    name: "Game",
};
</script>
