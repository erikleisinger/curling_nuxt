<template>
    <div class="profile__container">
        <div @click="handleClick">
        <slot name="avatar"  >
            <Avataaar
                v-bind="parseAvatar(avatar)"
                :class="{ animated__avatar: animated }"
                
            />
        </slot>
        </div>

        <div
            class="truncate-text col-auto q-pl-xs q-ml-xs column justify-center text-md column no-wrap" style="overflow: visible"
        >
            <q-item-label overline v-if="type">{{ typeName }}</q-item-label>
            <q-item-label class="truncate-text">
                <slot />
            </q-item-label>
            <q-item-label caption v-if="slots.subtitle">
                <slot name="subtitle" />
            </q-item-label>
        </div>
        <div class="row justify-end items-center" v-if="slots.append">
            <slot name="append" />
        </div>
    </div>
</template>
<style lang="scss">
.profile__container {
    display: grid;
    grid-template-columns: 3em auto auto;
    padding: var(--space-sm);
    
    .uploaded-avatar__container {
        aspect-ratio: 1/1;
        width: 100%;
        background-color: rgba(0,0,0,0.1);
        border-radius: 50%;
        overflow: hidden;
    }
}



@keyframes scale {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}
</style>
<script setup>
import { parseAvatar } from "@/utils/avatar";
import {useDialogStore} from '@/store/dialog'

const props = defineProps({
    animated: Boolean,
    avatar: String,
    item: Object,
    onClick: Function,
    type: String,
    viewable: {
        type: Boolean,
        default: true
    }
});

const typeName = ref(
    {
        team: "Team",
    }[props.type]
);
const slots = useSlots();

const handleClick = () => {
    if (props.onClick) {
        props.onClick();
        return;
    }
}




</script>
