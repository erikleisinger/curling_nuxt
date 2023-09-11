<template>
    <div/>
</template>
<script setup>
    import {useDialogStore} from '@/store/dialog'
    onMounted(() => {
        useDialogStore().toggleLineScore({open: true})
    })
</script>