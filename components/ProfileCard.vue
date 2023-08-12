<template>
    <div class="profile__container">
        <slot name="avatar">
            <Avataaar
                v-bind="parseAvatar(avatar)"
                :class="{ animated__avatar: animated }"
                @click="handleClick"
            />
        </slot>

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

    // border-bottom: 1px solid $grey-3;

    .animated__avatar {
        animation: float 0.7s infinite linear;
        animation-direction: alternate;
        animation-iteration-count: infinite;

        &:hover {
            animation: scale 0.3s forwards linear;
        }
    }
}

@keyframes float {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(0.15em);
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
import {useEditorStore} from '@/store/editor'

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
    if (!props.type || !props.viewable) return;
    const editorStore = useEditorStore();

    if (props.type === 'team') {
        editorStore.toggleTeamViewer({open: true, team: props.item})
    } else if (props.type === 'player') {
           editorStore.togglePlayerEditor({open: true, editedPlayer: props.item})
    }
}
</script>
