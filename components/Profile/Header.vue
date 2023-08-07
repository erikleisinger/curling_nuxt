<template>
       <div
        class="row bg-white full-width row profile__head box-shadow--dark row no-wrap"
        ref="header"
    >
        <div class="col-3" style="max-width: min(20vw, 125px)">
            <PlayerAvatar
                :parsedAvatar="parseAvatar(avatar)"
                :player="{ ...player, profile_id_for_player: profileId }"
                hidePlayerIcon
            />
        </div>
        <div class="column justify-center q-ml-sm">
        <h1
            class=" row items-center text-bold text-black text-md "
            style="z-index: 2"
        >
            {{firstName}} {{lastName}}
        </h1>
        <h2 class="text-sm">
@{{ username }}
        </h2>
        </div>
        <div class="col-grow row justify-end q-mr-sm">
        <q-btn flat round icon="logout" @click="logout" color="deep-purple"/>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.profile__header {
    padding: var(--space-xs) var(--space-xxxs) ;
    z-index: 3;
    position: relative;
}
</style>