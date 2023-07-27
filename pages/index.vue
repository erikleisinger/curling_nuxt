<template>
<NuxtLayout>
<main class="main column items-center justify-center">
    <q-btn to="/game" class="q-mb-md" rounded >Resume Game</q-btn>
    <q-btn to="/select" class="q-mb-md" rounded>Select a game</q-btn>
     <q-btn @click="handleLogout" rounded>Logout</q-btn>
</main> 
</NuxtLayout>

</template>
<style lang="scss" scoped>
    .main {
        height: 100%;
        width: 100%;
    }
</style>
<script setup>
const handleLogout = () => {
const {logout} = useSession()
logout();
}
    
</script>

