<template>
    <GlobalLoading :value="progress - 0.1" :label="status" />
</template>
<script setup>
import {timeout} from '@/business/utils/async/timeout'

const route = useRoute();
const nextPage = route.query.redirect;

const status = ref("");

const { initData, verifyData, progress } = useData();
onMounted(async () => {
    await initData();
    await verifyData();
    const { hash } = route;
    setTimeout(() => {
            return navigateTo(`${nextPage ?? '/'}${hash ?? ""}`);
    }, 2000);
});
</script>
