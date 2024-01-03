<template>
    <div class="nav-drawer" :class="{ open: modelValue, mobile: $q.screen.xs }">
        <div>
            <div class="row items-center " :style="modelValue ? 'margin-left: 16px' : 'margin: auto'" :class="{'justify-center': !modelValue}">
                <div style="width: 50px" class="clickable">
                    <Avataaar v-bind="parseAvatar(user?.avatar)" />
                </div>
                <div v-if="modelValue" class="q-ml-md">
                <div class=" text-md text-bold">{{ user.first_name }} {{ user.last_name }}</div>
                 <div class="text-sm">{{ rink?.name }}</div>
                </div>
            </div>
            <q-separator v-if="modelValue" size="3px" class="separator-yellow q-mt-md q-mx-md"/>
            <div class="drawer-header">Teams</div>
            <div
                style="width: 40px; margin-left: auto; margin-right: auto"
                class="clickable q-mt-md"
                v-for="team in userTeams"
                :key="team.id"
            >
                <TeamAvatar :teamId="team.id" />
            </div>
            <div class="drawer-header">Leagues</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.nav-drawer {
    position: absolute;
    left: 0;
    top: 0;
    width: 80px;
    transition: all 0.1s;
    background-color: $app-slate;
    padding-top: calc(4em + var(--space-sm));
    @include sm {
        padding-top: calc(5em + var(--space-sm));
    }
    &.mobile {
        width: 0px;
    }
    &.open {
        width: 300px;
        background-color: white;
    }
    height: calc(100 * var(--vh, 1vh));
    z-index: 10;
    .drawer-header {
        color: white;
        font-family: $font-family-header;
        margin: auto;
        width: fit-content;
        padding-top: 28px;
        font-size: 18px;
        line-height: 18px;
    }
    .separator-yellow {
        background-color: $app-yellow;
    }
}
</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import Rink from '@/store/models/rink'
import { parseAvatar } from "@/utils/avatar";
import Player from "@/store/models/player";
const props = defineProps({
    modelValue: Boolean,
});
const $q = useQuasar();

const { user: userId } = useUser();
const user = computed(() => useRepo(Player).where("id", userId.value).first());
const userTeams = computed(() => useUserTeamStore().userTeams);
const rink = computed(() => useRepo(Rink).where('id', user.value?.rink_id).first())
</script>
