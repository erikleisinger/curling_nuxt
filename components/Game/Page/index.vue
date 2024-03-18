<template>
<q-inner-loading :showing="loading"/>
    <div class="container" v-if="!loading && !error" ref="container">
        <GamePageHeader :gameId="gameId" />
        <GamePageSummary :gameId="gameId" />
        <div class="details">
            <GamePageLinescore :gameId="gameId" />
            <GameStatsView :gameId="gameId" />
        </div>
        <div class="full-width row justify-around">

        <GamePageDeleteHandler :gameId="gameId" />
        <GamePageEditHandler :gameId="gameId"/>
        </div>
    </div>
    <ErrorPage v-else-if="error" >
        {{error}}
    </ErrorPage>  
</template>
<style lang="scss" scoped>
.container {
    position: relative;
    padding-bottom: var(--space-xl);
    &:before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        width: 3px;
        height: 100%;
        border-left: 1px solid rgba(0, 0, 0, 0.08);
        border-right: 1px solid rgba(0, 0, 0, 0.08);
    }
}
.details {
    @include sm {
        padding: 0px var(--space-xl);
    }
    margin-bottom: var(--space-xxl);
}
</style>
<script setup>
import { getFullGame } from "@/business/api/query/game";

const props = defineProps({
    gameId: Number,
});

const { setLoading } = useLoading();


const {fetch} = useApi();

const {loading, error} = fetch(getFullGame(props.gameId), {
    onComplete: () => {
        setLoading(false);
    }
})

</script>
<script>
export default {
    name: "Game",
};
</script>
