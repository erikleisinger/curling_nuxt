<template>
    <Team v-if="resource?.resourcetype === 'team'" :team="resource">
        <template v-slot:appendButton>
            <q-btn
                flat
                round
                icon="search"
                color="grey-8"
                @click="toggleSearch"
            />
        </template>
    </Team>
    <Rink v-if="resource?.resourcetype === 'rink'" :rink="resource">
        <template v-slot:appendButton>
            <q-btn
                flat
                round
                icon="close"
                color="grey-8"
                @click="toggleSearch"
            />
        </template>
    </Rink>
    <Event v-if="resource?.resourcetype === 'event'" :event="resource">
        <template v-slot:appendButton>
            <q-btn
                flat
                round
                icon="close"
                color="grey-8"
                @click="toggleSearch"
            />
        </template>
    </Event>

</template>
<style lang="scss" scoped>
// .outer-header__container {
//     position: fixed;
//     top: 0;
//     box-shadow: $pretty-shadow;
//     z-index: 1;
//     width: 100%;

// }
</style>
<script setup>
import { useElementSize, useThrottleFn } from "@vueuse/core";
import { TABLE_QUERIES } from "@/constants/query";
const tab = ref("stats");
import { useTeamStore } from "@/store/teams";
import {useDialogStore} from '@/store/dialog'
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

    console.log('resource: ', resource)

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

const {toggleGlobalSearch} = useDialogStore();

const toggleSearch = () => {
    toggleGlobalSearch({
        open: true, 
        options: {
            inputLabel: 'Search for a team, player, rink, or event',
            callback: onSelect,
        }
    })
}

onMounted(() => {
    toggleSearch();
})
</script>
