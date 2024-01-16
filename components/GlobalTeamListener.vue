<template>
    <div/>
</template>
<script setup>

const {user: userId} = useUser()
 const startWebsockets = () => {
    console.log('start team listener: ', userId.value)
                const client = useSupabaseClient();
                client
                    .channel("team_profile_junction")
                    .on(
                        "postgres_changes",
                        {
                            event: "*",
                            schema: "public",
                            table: "team_profile_junction",
                            filter: `profile_id=eq.${userId.value}`,
                        },
                        (e) => {
                          console.log('team change: ', e)
                        }
                    )
                    // .on(
                    //     "postgres_changes",
                    //     {
                    //         event: "UPDATE",
                    //         schema: "public",
                    //         table: "notifications",
                    //         filter: `profile_id=eq.${userId.value}`,
                    //     },
                    //     (e) => {

                    //         const { new: newData } = e;
                    //         const { read } = newData;
                    //         if (!read) {
                    //             count.value += 1;
                    //         } else {
                    //             count.value -= 1;
                    //         }
                    //     }
                    // )
                    .subscribe();
            };
    onMounted(() => {
        startWebsockets();
    })
</script>