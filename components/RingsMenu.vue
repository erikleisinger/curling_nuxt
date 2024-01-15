<template>
    <div class="wrap row justify-end" :class="{ big: handleOverflow }">
        <Rings :class="{ big }"
            @click="setBig"
            :twelveft="big ? undefined : 'white'"
            :eightft="big ? undefined : getColor('slate')"
            :fourft="big ? undefined : 'white'"
            :buttonft="big ? undefined : getColor('slate')"
            ref="ringsMenu" :size="size"/>
        <div class="menu__container column items-center" v-if="big">
            <div class="rings-menu__option option-1" @click="toggleSearch">search</div>
            <div
                class="rings-menu__option"
                @click.stop="
                    doAction($event, () => navigateTo('/games/create'))
                "
            >
                New game
            </div>
            <div
                class="rings-menu__option"
                @click.stop="
                    doAction($event, () =>
                        navigateTo('/teams/create')
                    )
                "
            >
                New team
            </div>
            <div class="rings-menu__option bottom small">Send feedback</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$mid-dimension: 65.72%;
$inner-dimension: 56.522%;
$button-dimension: 38.5%;
.wrap {
    position: absolute;
    top: 0;
    right: 0;
    overflow: hidden;
    width: $app-width;
    height: 100vh;
    transform: all 0.3s;
    top: -22px;
    right: -12px;
    padding-top: 22px;
    padding-right: 12px;
    pointer-events: none;
}
:deep(.rings) {
    border-radius: 50%;
    transition: transform 0.3s;
    position: relative;
    pointer-events: all;

    &.big {
        transform: scale(40);
        @include sm {
            transform: scale(60);
        }
        opacity: 0.95;
        position: absolute;
        top: 22px;
        right: 12px;
        z-index: 11;
    }
    &.outer {
        background-color: #6cc0e5;
        height: v-bind(size);
        width: v-bind(size);
    }
    &.mid {
        height: $mid-dimension;
        width: $mid-dimension;

        background-color: white;
    }
    &.button,
    &.mid,
    &.inner {
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    &.button {
        background-color: white;
        height: $button-dimension;
        width: $button-dimension;
    }
    &.inner {
        background-color: #fb4f4f;
        height: $inner-dimension;
        width: $inner-dimension;
    }
}
.menu__container {
    pointer-events: none;
    position: fixed;
    width: fit-content;
    top: 0;
    z-index: 100;
    left: 0;
    right: 0;
    margin: auto;
    padding: var(--space-lg) 0px;
    @include sm {
        padding: var(--space-xxl) 0px;
    }
    .rings-menu__option {
        cursor: pointer;
        pointer-events: all;
        border-bottom: 4px solid $app-yellow;
        font-family: $font-family-header;
        color: $app-slate;
        font-size: 64px;
        line-height: 50px;
        width: fit-content;
        margin-bottom: 36px;

        @include sm {
            margin-bottom: 50px;
            font-size: 70px;
            line-height: 50px;
        }

        &:hover {
            transition: transform 0.3s;
            transform: scale(1.1) !important;
        }
        &.bottom {
            margin-top: 150px;
            @include sm {
                margin-top: 250px;
            }
        }
        &.small {
            font-size: 24px;
            line-height: 24px;
            @include sm {
                font-size: 40px;
                line-height: 40px;
            }
        }
    }
    .option-1 {
        font-size: 64px;
        line-height: 50px;
        @include sm {
            font-size: 96px;
            line-height: 70px;
        }
    }
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import {
    onClickOutside,
    useParentElement,
    useElementBounding,
} from "@vueuse/core";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

const {getColor} = useColor();

const big = ref(false);
const props = defineProps({
    size: {
        type: String,
        default: "35px",
    },
});

const setBig = () => {
    big.value = !big.value;
    if (!big.value) return;
    nextTick(() => {
        gsap.from(document.querySelectorAll(".rings-menu__option"), {
            scale: 0,
            opacity: 0.5,
            stagger: 0.2,
            duration: 0.9,
            delay: 0.1,
            ease: "elastic",
        });
    });
};

const dialogStore = useDialogStore();
const { toggleTeamCreator, toggleGlobalSearch } = dialogStore;

const doAction = (e, callback) => {
    e.stopPropagation();
    setBig();
    callback();
};
const ringsMenu = ref(null);
onClickOutside(ringsMenu, (e) => {
    const { target } = e;
    if (!target.className || (!Array.isArray(target.className) && typeof target.className !== 'string')) return;
    if (target.className === 'rings-menu__option' || target?.className?.split(" ")?.includes("rings-menu__option")) return;
    if (!big.value) return;
    setBig();
});

const parent = useParentElement(ringsMenu);
const { right } = useElementBounding(document.querySelector(".q-header"));

const handleOverflow = ref(false);
watch(big, (val) => {
    if (val) {
        handleOverflow.value = true;
    } else {
        setTimeout(() => {
            handleOverflow.value = false;
        }, 1);
    }
});


// SEARCH

const toggleSearch = () => {
    big.value = false
    toggleGlobalSearch({
        open: true,

        options: {
            resourceTypes: ['team', 'profile', 'rink', 'league'],
            inputLabel: "Search for a team, player, rink, or event",
            callback: onSelect,
        },
    });
};

const searchOpen = computed(() => dialogStore.globalSearch.open)

const onSelect = (selection) => {
    toggleGlobalSearch({
        open: false,
    });
    if (selection.resourcetype === "team") {
        return navigateTo(`/teams/${selection.id}`);
    }
    if (selection.resourcetype === "profile") {
        return navigateTo(`/player/${selection.profile_id}`);
    }
    if (selection.resourcetype === 'rink') {
        return navigateTo(`/rinks/${selection.id}`);
    }
     if (selection.resourcetype === 'league') {
        return navigateTo(`/leagues/${selection.id}`);
    }
};
</script>
