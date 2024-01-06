<template>
    <main>
        <!-- <LayoutSection title="Season Overview">
            <SeasonOverview :teamIds="userTeams" />
        </LayoutSection> -->
        <LayoutSection title="The Latest" mainStyle="padding-left: unset; padding-right: unset; padding-top: var(--space-sm)">
            <RinkNews v-if="homeRink?.id" :rinkId="homeRink.id" :limit="10" />
        </LayoutSection>
    </main>
</template>

<script setup>
import {useUserTeamStore} from '@/store/user-teams'
import { useUserStore } from "@/store/user";
import Rink from "@/store/models/rink";
const $q = useQuasar();
const user = computed(() => useUserStore());
const homeRink = computed(() =>
    useRepo(Rink).where("id", user.value?.rink_id).first()
);

const userTeams = computed(() => useUserTeamStore().userTeams.map(({id}) => id))
</script>
