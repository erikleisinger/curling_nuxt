<template>
    <div class="full-height full-width cont">
        <table class="stats-table">
            <thead>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <q-icon name="circle" color="red" size="0.8em" />
                    </td>
                    <td>Red</td>
                    <td><q-icon name="arrow_drop_up" color="green" />5%</td>
                    <td>100%</td>
                    <td>(15/16)</td>
                </tr>
                <tr class="subitem">
                    <td></td>
                    <td>Up 2+</td>
                </tr>
                <tr class="subitem">
                    <td></td>
                    <td>Up 2+</td>
                </tr>
                <tr class="subitem">
                    <td></td>
                    <td>Up 2+</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
.cont {
    background-color: $app-slate;
}
.stats-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    color: white;
    th {
        // &:nth-child(even) {
        //     background-color: rgba(0,0,0,0.4);
        // }
        // &:nth-child(odd) {
        //     background-color: rgba(0, 0, 255, 0.216);
        // }

        &:nth-child(1) {
            width: calc(0.8em + var(--space-sm));
        }

        &:nth-child(2) {
            width: 100%;
        }

        &:nth-child(3) {
            width: 50px;
        }
        &:nth-child(4) {
            width: 70px;
            max-width: 80px;
        }

        &:nth-child(5) {
            width: 50px;
        }
    }

    td {
        padding: 4px;
        white-space: nowrap;
        &:nth-child(2) {
            font-family: $font-family-header;
            @include smmd-text;
        }
        &:nth-child(4) {
            font-family: $font-family-header;
            @include md-text;
        }
        &:nth-child(3) {
            @include text-caption;
        }
        &:nth-child(5) {
            @include text-caption;
        }
    }

    tr {
        &.subitem {
           
            td {
                 @include reg-text;
                &:nth-child(2) {
                    border-left: 2px solid white;
                }
            }
        }
    }
}
</style>

<script setup></script>
