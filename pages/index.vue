<template>
    <NuxtLayout>
        <AreaSeason/>
    </NuxtLayout>
</template>
<script setup>
const handleLogout = () => {
    const { logout } = useSession();
    logout();
};
</script>
