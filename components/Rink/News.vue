<template>
    <div v-if="isLoading">
        <q-item
            style="max-width: 300px"
            v-for="i in Array.from(Array(3).keys())"
            :key="i"
        >
            <q-item-section avatar>
                <q-skeleton type="QAvatar"></q-skeleton>
            </q-item-section>

            <q-item-section>
                <q-item-label>
                    <q-skeleton type="text"></q-skeleton>
                </q-item-label>
                <q-item-label caption>
                    <q-skeleton type="text" width="65%"></q-skeleton>
                </q-item-label>
            </q-item-section>
        </q-item>
    </div>
    <div v-else-if="!isLoading">
        <div v-for="item in news" :key="item.id" class="news-item">
            <AchievementHistoryItem :item="item" />
           
        </div>
        <div
            v-if="!isLoading && !news?.length"
            class="full-width text-center text-bold"
        >
            No news to show.
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .news-item {
        background-color: white;
        box-shadow: $pretty-shadow;
        border-radius: 16px;
        margin-bottom: var(--space-sm)
    }
</style>
<script setup>
import { useQuery } from "@tanstack/vue-query";
import { useUserStore } from "@/store/user";
import Team from "@/store/models/team";

const props = defineProps({
    limit: {
        type: Number,
        default: 3,
    },
    rinkId: Number,
    showAll: Boolean,
});

const cursor = ref(0);
const getRinkNews = async () => {
    const client = useSupabaseClient();

    const { data } = await client
        .rpc("get_rink_news", {
            rink_id_param: props.rinkId,
        })
        .limit(props.limit);

    data.forEach((item) => {
        if (!item.team?.id) return;
        useRepo(Team).save(item.team);
    });
    return data;
};

const { isLoading, data: news } = useQuery({
    queryKey: ["rink", "news", props.rinkId],
    queryFn: getRinkNews,
    refetchOnWindowFocus: false,
});
</script>
<script>
export default {
    name: "RinkNews",
};
</script>
