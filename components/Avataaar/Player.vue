<template>
<div class="container">
    <div class="dash"/>
    <div class="inner"/>
    <div class="outer"/>
    <Avataaar v-bind="parseAvatar(user?.avatar)" class="avatar" />
</div>
</template>
<style lang="scss" scoped>
$border-width: 8px;
$avatar-offset: 10%;
$border-color: #804a00;
$outer-border-width: 2px;
    .container {
        background: $bg-badge--amber;
        position: relative;
        width: 100%;
        aspect-ratio: 1/1;
        border-radius: 50%;
        .avatar {
            position: absolute;
            width: calc(100% - $avatar-offset);
            bottom: $avatar-offset / 2;
   
            left: 0;
            right: 0;
            margin: auto;
        }
        .inner {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            margin: auto;
            background-color: rgba(0,0,0,0.1);
            border-radius: 50%;
            width: 100%;
            aspect-ratio: 1/1;
            
        }

        .outer {
            position: absolute;
            // top: calc(-1 * $outer-border-width);
            // bottom: calc(-1 * $outer-border-width);
            // right: calc(-1 * $outer-border-width);
            // left: calc(-1 * $outer-border-width);
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            margin: auto;
            border: $outer-border-width solid rgba(0,0,0,0.1);
            
            border-radius: 50%;
   
            aspect-ratio: 1/1;
        }

    }

    @keyframes rotation {
    0% {
        transform: rotateZ(0deg);
    }
    100% {
        transform: rotateZ(360deg);
    }
}
</style>
<script setup>
import Player from "@/store/models/player";
import { parseAvatar } from "@/utils/avatar";
const props = defineProps({
    playerId: Number,
});

const user = computed(() =>
    useRepo(Player).where("id", props.playerId).first()
);
</script>
