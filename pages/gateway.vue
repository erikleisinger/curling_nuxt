<template>
    <GlobalLoading :value="progress - 0.1" :label="status" />
</template>
<script setup>
import { useRouteQuery } from "@vueuse/router";
const nextPage = useRouteQuery("redirect");

const status = ref("");

const { initData, verifyData, progress } = useData();
onMounted(async () => {
    await initData();
    await verifyData();
    if (!!nextPage?.value) {
        navigateTo(nextPage.value)
    } else {
        navigateTo('', {replace: true})
    }
});
</script>
