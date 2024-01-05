<template>
    <main>
        <LayoutSection title="Season Overview">
            <SeasonOverview />
        </LayoutSection>
        <LayoutSection title="The Latest">
            <RinkNews v-if="homeRink?.id" :rinkId="homeRink.id" :limit="10" />
        </LayoutSection>
    </main>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import Rink from "@/store/models/rink";
const $q = useQuasar();
const user = computed(() => useUserStore());
const homeRink = computed(() =>
    useRepo(Rink).where("id", user.value?.rink_id).first()
);
</script>
