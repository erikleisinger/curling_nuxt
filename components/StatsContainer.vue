<template>
    <div class="stats__container--wrap">
        <q-card class="q-mx-md q-my-auto stats__container q-px-md q-py-sm pretty-shadow" >
            <h1 class="text-md  q-my-sm text-bold"><slot name="title"/></h1>
            <q-card-section class="q-px-none">
                <div
                    class="full-width row justify-center"
                
                >
                <div style="width: 100%" >
                    <slot/>

                    </div>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>
<style lang="scss">
.stats__container--wrap {
    .stats__container {
        // background-color: rgba(0, 0, 0, 0.6) !important;
        // border: 1px solid rgba(225, 255, 255, 0.1);
        border-radius: 32px;
        margin-bottom: var(--space-lg);

        .q-card__section {
            padding-top: 0px;
            padding-bottom: 0px;
        }
    }
}
</style>
