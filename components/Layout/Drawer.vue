<template>
    <div
        class="nav-drawer"
        :class="{ open, mobile: $q.screen.xs }"
        ref="drawer"
        @click="onDrawerClick"
    >
    <!-- <div class="click-overlay" v-if="!open"/> -->
        <div
            :style="{ opacity: open || !$q.screen.xs ? 1 : 0 }"
            class="nav-drawer--content"
        >
            <div class="row items-center">
                <div style="width: 50px" class="clickable" @click="navigateTo(`/player/${user?.id}`)">
                    <Avataaar v-bind="parseAvatar(user?.avatar)" />
                </div>
                <div  class="q-ml-md q-pt-xs">
                    <div class="text-md text-bold">
                        {{ user?.first_name }} {{ user?.last_name }}
                    </div>
                    <div class="text-sm" style="margin-top: -4px">{{ rink?.name }}</div>
                </div>
            </div>
            <q-separator
                v-show="true"
                size="3px"
                class="separator-yellow q-mt-md"
                  :style="{ opacity: open ? 1 : 0 }"
            />
            <div class="drawer-header" :class="{ dark: !open }">
                Teams
                <q-btn flat round dense icon="arrow_drop_down" v-if="open" />
            </div>
            <q-list separator>
            <q-item
            clickable v-ripple
                class="row items-center no-wrap team-container"
                :style="{ width: open ? '' : 'fit-content' }"
                v-for="team in userTeams"
                :key="team.id"
                @click="navigateTo(`/teams/${team.id}`)"
            >
            <q-item-section avatar>
                <div style="width: 40px; min-width: 40px" class="clickable">
                    <TeamAvatar :teamId="team.id" :disableMenu="true"/>
                </div>
            </q-item-section>
            <q-item-section>
                <div class="q-ml-md">
                    {{ team.name }}
                </div>
            </q-item-section>
            </q-item>
            </q-list>
            <div class="drawer-header" :class="{ dark: !open }">Leagues</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.nav-drawer {
    position: absolute;
    left: 0;
    top: 0;
    width: 80px;
    transition: all 0.2s;
    background-color: $app-slate;
    padding-top: calc(4em + var(--space-sm));
    overflow: hidden;
    @include sm {
        padding-top: calc(5em + var(--space-sm));
    }
    transform-origin: left;
    &.mobile {
        // transform: scaleX(0) translateX(-50px);
        width: 0px;
    }
    &.open {
        width: 300px;
        background-color: white;
        transform: scaleX(1);
    }
    height: calc(100 * var(--vh, 1vh));
    z-index: 10;
    .nav-drawer--content {
        position: absolute;
        top: 0;
        left: 16px;
        top: calc(4em + var(--space-sm));
        @include sm {
            top: calc(5em + var(--space-sm));
            width: 300px;
        }
    }
    .drawer-header {
        color: $app-slate;
        font-family: $font-family-header;

        width: fit-content;
        margin-top: 28px;
        font-size: 18px;
        line-height: 12px;
        min-height: 35px;
        // margin-bottom: -10px;
        @include sm {
            font-size: 22px;
            line-height: 22px;
        }
        &.dark {
            color: white;
            width: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: -16px;
            
        }
    }
    .separator-yellow {
        background-color: $app-yellow;
        box-sizing:content-box;
        margin-left: 0px;
        margin-right: 36px;
    }
    .team-container {
        margin-left: -12px;
        
        color: $app-slate;
    }
    .click-overlay {
        position: absolute;
        height: 100%;
        width: 80px;
        z-index: 2;
        top: 0;

    }
}
</style>
<script setup>
import { onClickOutside, useSwipe } from "@vueuse/core";
import { useUserTeamStore } from "@/store/user-teams";
import Rink from "@/store/models/rink";
import { parseAvatar } from "@/utils/avatar";
import Player from "@/store/models/player";
const props = defineProps({
    modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const open = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});
const $q = useQuasar();

const { user: userId } = useUser();
const user = computed(() => useRepo(Player).where("id", userId.value).first());
const userTeams = computed(() => useUserTeamStore().userTeams);
const rink = computed(() =>
    useRepo(Rink).where("id", user.value?.rink_id).first()
);

const route = useRoute();
watch(
    () => route.path,
    (val, oldVal) => {
        console.log('route changed: ', val, oldVal, oldVal !== val)
        if (val !== oldVal) {
            setTimeout(() => {
open.value = false;
            }, 1)
        }
    }
);

const drawer = ref(null);
onClickOutside(drawer, (e) => {
    const { target } = e;
    if (!open.value) return;

    setTimeout(() => {
        open.value = false;
    }, 1);
});

const { isSwiping, direction } = useSwipe(document);
watch(isSwiping, (val) => {
    if (!val) return;
    if (direction.value === "right" && !open.value) {
        open.value = true;
    } else if (direction.value === "left" && !!open.value) {
        open.value = false;
    }
});

const onDrawerClick = () => {
    if (open.value) return;
    open.value = true;
}


</script>
