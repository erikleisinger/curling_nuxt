<template>
<main class="main column items-center justify-center">
    <!-- <SelectWheel :options="[{value: 0, label: 'New game', to:'/select?edit=true'}, {value: 1, label: 'Select game', to: '/select'}]" :active="true" persistent size="150px"/> -->
    <q-btn to="/game" >Game</q-btn>
    <q-btn to="/select">Select</q-btn>
     <q-btn @click="handleLogout">Logout</q-btn>
</main> 

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

