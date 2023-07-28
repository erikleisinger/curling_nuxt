<template>
    <div class="row bg-white full-width q-pa-md row profile--container pretty-shadow" ref="header">
        <ProfileAvatar
            :path="avatarUrl"
            size="4"
            @click="expand"
            style="z-index: 3"
        />
        <h1
            class="col-grow row items-center text-bold text-black text-lg username"
            style="z-index: 2"
        >
            {{ username }}
        </h1>

       
    </div>
     <div
            class="profile--expandable box-shadow--dark"
            ref="profileContainer"
            :class="expanded ? 'grow' : 'shrink'"
        >
            <LazyProfile />
        </div>
</template>
<style lang="scss" scoped>
.profile--container {
    padding: var(--space-sm);
    z-index: 10;
}
h1.username {
        margin-left: var(--space-sm)!important;
    }
.profile--expandable {
    background-color: white;
    transition: all 0.2s;
    top: v-bind(top);
    left: 0;
    position: absolute;
    z-index: 2;
    &.grow {
        transform: translateX(0);
      
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
};

const header = ref(null);
const { height } = useElementSize(header);

// 0.75 * 1em is --var(space-sm), *2 for top and bottom padding
const top = computed(() => `calc(${height.value}px + 0.75 * 1em * 2)`);

const profileContainer = ref(null);
const { direction } = useSwipe(profileContainer, {
    onSwipe: () => {
        if (direction.value === "left") {
            expanded.value = false;
        }
    },
    threshold: 150,
});

const props = defineProps({
    modelValue: Boolean,
});
const emit = defineEmits(["update:model-value"]);
const expanded = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:model-value", val);
    },
});
</script>
