<template>
    <GlobalLoading :value="progress - 0.1" :label="status" />
</template>
<script setup>
import { useRouteQuery } from "@vueuse/router";
const nextPage = useRouteQuery("redirect");

const route = useRoute()

const status = ref("");

const { initData, verifyData, progress } = useData();
onMounted(async () => {
    await initData();
    await verifyData();
     const {hash} = route;
    setTimeout(() => {
  if (!!nextPage?.value) {
        navigateTo(`${nextPage.value}${hash}`)
    } else {
        navigateTo(`${hash}`, {replace: true})
}
    }, 1)
  
});
</script>
