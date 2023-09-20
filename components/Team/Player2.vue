<template>
    <div class="player-container row">
        <div class="avatar-container">
            <Avataaar v-bind="{}" />
        </div>
        <div>
        <div class="firstname text-sm text-uppercase font-main">
            Dawn
        </div>
        <div class="lastname text-lg text-uppercase font-main text-bold">
            Askin
        </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.player-container {
    border: 1px solid rgba(0,0,0,0.2);
    padding: var(--space-sm);
    color: #36454F;
    .avatar-container {
    
        width: 2.2em;
    }

    .lastname {
        margin-top: -0.3em;
    }
}
</style>
