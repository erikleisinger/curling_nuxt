<template>
    <Teleport to="body">
        <div class="outer__container">
            <div class="pretty-shadow inner__container">
                <div
                    class="row bg-deep-purple text-white pretty-shadow justify-end items-center"
                    style="
                        height: 3em;
                        border-top-right-radius: inherit;
                        border-top-left-radius: inherit;
                    "
                >
                    <q-btn flat round icon="close" @click="emit('close')"/>
                </div>
                <TablePlayers    style="height: calc(100% - 3em); border-bottom-left-radius: 16px; border-bottom-right-radius: 16px">
                    <template v-slot:actions="{playerId}">
                        <q-btn @click="emit('select', playerId)"  flat round icon="add" color="deep-purple"/>
                    </template>
                </TablePlayers>
            </div>
        </div>
    </Teleport>
</template>
<style lang="scss" scoped>
.outer__container {
    height: calc(100 * var(--vh, 1vh));
    width: 100vw;
    z-index: 100000;
    position: absolute;
    top: 0;
    .inner__container {
        background-color: white;
        pointer-events: all;
        border-radius: 16px;
        height: calc(100% - 32px);
        margin: 16px;
    }
}
</style>
<script setup>
const emit = defineEmits(["close", "select"]);
</script>
