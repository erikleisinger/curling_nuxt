<template>
    <header class="outer-header__container" ref="header" v-if="showSearch">
        <AreaSearch
            v-if="showSearch"
            @close="showSearch = false"
            @select="onSelect"
            inputLabel="Search for a team, rink, or event"
        />

    </header>
    <Team v-else :team="team">
        <template v-slot:appendButton>
            <q-btn
                flat
                round
                icon="search"
                color="grey-8"
                @click="showSearch = true"
            />
        </template>
    </Team>
</template>
<style lang="scss" scoped>
.outer-header__container {
    box-shadow: $pretty-shadow;

}
</style>
<script setup>
import { useElementSize, useThrottleFn } from "@vueuse/core";
import { TABLE_QUERIES } from "@/constants/query";
const tab = ref("stats");
import { useTeamStore } from "@/store/teams";
const store = useTeamStore();

const teams = computed(() => store.teams);

const team = ref(null);

const onSelect = (selection) => {
    if (selection.resourcetype === 'team') {
    team.value = {
        ...selection,
        team_avatar: selection.avatar
    }
    }

    showSearch.value = false;
};

const index = ref(0);

const swipe = ref(null);

const showSearch = ref(true);

const inputRef = ref(null);

const clickable = ref(true);

const global = ref(false);

const header = ref(null);
const { height: headerHeight } = useElementSize(header);

const mainHeight = computed(() => `calc(100% - ${headerHeight.value}px)`);

const avatarHeader = ref(null);
const { height: avatarHeight } = useElementSize(avatarHeader);
</script>
