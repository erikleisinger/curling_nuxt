<template>
    <div class="row header" ref="header">
        <div class="header q-pa-md row" style="z-index: 3">
            <ProfileAvatar
                :path="avatarUrl"
                size="4"
                @click="expand"
                style="z-index: 3"
            />
            <div
                class="col-grow row items-center q-ml-md text-bold"
                style="font-size: 1.5em; color: black; z-index: 2"
            >
                {{ username }}
            </div>
        </div>
        <div class="profile--expandable" ref="profileContainer" :class="expanded ? 'grow' : 'shrink'">
            <LazyProfile  />
        </div>
        <div class="blind" />
    </div>
</template>
<style lang="scss" scoped>
.header {
    width: 100%;
    background-color: white;
}
.blind {
    height: 6em;
    width: 50%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background-color: white;
}
.profile--expandable {
    background-color: white;
    transition: all 0.2s;
    top: v-bind(top);
    left: 0;
    position: absolute;
    z-index: 2;
    // overflow:auto;
    &.grow {
        // transform: v-bind(grow);
        transform: translateX(0)
    }
    &.shrink {
        transform: translateX(-100vw);
    }
    z-index: 1;
}
</style>
<script setup>
import { useElementSize, useSwipe, useScroll } from "@vueuse/core";
import { useUserStore } from "@/store/user";
const store = useUserStore();
const avatarUrl = ref("");
const username = ref("");
onMounted(() => {
    avatarUrl.value = store.avatarUrl;
    username.value = store.username;
});

const expand = () => {
    expanded.value = !expanded.value;
    // navigateTo('/profile')
};

const header = ref(null);
const { height } = useElementSize(header);

// const grow = computed(
//     () => `translateY(100vh) translate(-${height.value / 2 +10}px)`
// );
//
const top = computed(() => `${height.value}px`)

const profileContainer = ref(null)
const {direction} = useSwipe(profileContainer, {
    onSwipe: () => {
        if (direction.value === 'left') {
            expanded.value = false;
        }
    },
    threshold: 150
    })

const props = defineProps({
    modelValue: Boolean,
})
const emit = defineEmits(['update:model-value'])
const expanded = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:model-value', val)
    }
})



</script>
