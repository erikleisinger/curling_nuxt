<template>
    <GlobalLoading :value="progress - 0.1" :label="status" />
</template>
<script setup>
import { useRouteQuery } from "@vueuse/router";
const nextPage = useRouteQuery("redirect");

const status = ref("");

const { initData, verifyData, progress } = useData();
onMounted(async () => {
    console.log(nextPage)
    await initData();
    await verifyData();
    if (!!nextPage?.value) {
        console.log('going next page: ', nextPage.value)
        navigateTo(nextPage.value)
    } else {
        console.log('navigating to root')
        navigateTo('/', {replace: true})
    }
});
</script>
