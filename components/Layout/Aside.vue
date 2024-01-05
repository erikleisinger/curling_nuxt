<template>
    <aside class="layout-aside">
        <section class="aside-section">
            <header>
                <h2 class="text-md">Upcoming</h2>
                <h2 class="text-lg">Games</h2>
            </header>
            <q-separator class="separator" />
        </section>
        <section class="aside-section">
            <header>
                <h2 class="text-md">new</h2>
                <h2 class="text-lg">curlers</h2>
                <h3 class="text-sm">Royal Canadian Curling Club</h3>
            </header>
            <q-separator class="separator" />
        </section>
    </aside>
</template>
<style lang="scss" scoped>
.layout-aside {
    padding: var(--space-sm);


    .aside-section {
        padding: var(--space-sm);
        background-color: white;
        box-shadow: $pretty-shadow;
        height: fit-content;
        min-height: 300px;
        border-radius: 16px;
        margin-bottom: var(--space-md);
        header {
            margin-bottom: var(--space-sm);
            h2,
            h3 {
                text-align: right;
            }
            h2 {
                line-height: 34px;

                &:nth-child(1) {
                    font-size: 20px;
                }
                &:nth-child(2) {
                    font-size: 48px;
                }
            }
            h3 {
                margin-top: 2px;
                font-family: $font-family-secondary;
            }
        }
        .separator {
            height: 4px;

            background-color: $app-yellow;
            box-sizing: border-box;
        }
    }
}
</style>
