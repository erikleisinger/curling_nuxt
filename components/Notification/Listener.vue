<template>
    <div/>
</template>
<script setup>
const emit = defineEmits(['refresh'])
const { user: userId } = useUser();
const startWebsockets = () => {
    const client = useSupabaseClient();
    client
        .channel("notifications")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "notifications",
                filter: `profile_id=eq.${userId.value}`,
            },
            () => emit('refresh')
        )
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "notifications",
                filter: `profile_id=eq.${userId.value}`,
            },
            () => emit('refresh')
        )
        .subscribe();
};

onMounted(() => {
    startWebsockets();
});
</script>