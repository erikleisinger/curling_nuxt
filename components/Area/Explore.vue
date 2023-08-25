<template>

    <header class="outer-header__container" ref="header" v-if="showSearch">
        <AreaSearch
                v-if="showSearch"
                @close="showSearch = false"
                @select="onSelect"
                inputLabel="Search for a team, rink, or event"
        />

    </header>
    <Team v-else-if="resource?.resourcetype === 'team'" :team="resource">
        <template v-slot:appendButton>
            <q-btn
                flat
                round
                icon="close"
                color="grey-8"
                @click="showSearch = true"
            />
        </template>
    </Team>
    <Rink v-else-if="resource?.resourcetype === 'rink'" :rink="resource">
        <template v-slot:appendButton>
            <q-btn
                flat
                round
                icon="close"
                color="grey-8"
                @click="showSearch = true"
            />
        </template>
    </Rink>
    <Event v-else-if="resource?.resourcetype === 'event'" :event="resource">
        <template v-slot:appendButton>
            <q-btn
                flat
                round
                icon="close"
                color="grey-8"
                @click="showSearch = true"
            />
        </template>
    </Event>

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

const resource = ref(null);

const onSelect = (selection) => {
    if (selection.resourcetype === 'team') {
    resource.value = {
        ...selection,
        team_avatar: selection.avatar
    }
    } else {
        resource.value = selection;
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
