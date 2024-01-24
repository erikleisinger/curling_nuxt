<template>
    <div
        class="full-width full-height row justify-center items-center login--container"
    >
        <div
            class="column items-center full-height q-pb-lg q-pt-lg"
            :class="$q.screen.xs ? 'justify-center' : 'justify-end'"
        >
            <LogoFull width="125" />
        </div>
        <div class="login-card__wrap">
        <div class="login__card">
            <slot />
        </div>
        </div>
        <div />
    </div>
</template>
<style lang="scss" scoped>
.login--container {
    display: grid;

    grid-template-rows: 1fr auto 1fr;

    position: fixed;
    top: 0;
    left: 0;
    overflow: auto;

    @include bg-blue-side;

    .login__card {
        border-radius: 16px;
        box-shadow: unset;
        background: rgba(0, 0, 0, 0.1);
        width: min(400px, 100vw);
        box-sizing: border-box;
        min-height: 200px;
        color: white;
    }

    :deep(.q-field) {
        &:not(:first-child) {
            margin-top: var(--space-md);
        }
    }
}
</style>
<script setup>
const $q = useQuasar();
</script>
