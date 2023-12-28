<template>
    <div v-if="!isLoading">
        <div v-for="item in news" :key="item.id">
        <AchievementHistoryItem  :item="item"/>
    <q-separator/>
        </div>
        <div v-if="!isLoading && !news?.length" class="full-width text-center text-bold">
            No news to show.
        </div>
    </div>
</template>
<script setup>
    import {useQuery} from '@tanstack/vue-query';
    import {useUserStore} from '@/store/user'
    import Team from '@/store/models/team'

    const props = defineProps({
        limit: {
            type: Number,
            default: 3
        },
        rinkId: Number,
    })
    const getRinkNews = async () => {
        const client = useSupabaseClient();


        const {data} = await client.rpc('get_rink_news', {
            rink_id_param: props.rinkId
        }).limit(props.limit)

        data.forEach((item) => {
            if (!item.team?.id) return;
            useRepo(Team).save(item.team)
        })
        return data;
    }

    const {isLoading, data: news} = useQuery({
        queryKey: ['rink', 'news', props.rinkId],
        queryFn: getRinkNews,
        refetchOnWindowFocus: false
    })
</script>
<script>
export default {
    name: 'RinkNews'
}
</script>