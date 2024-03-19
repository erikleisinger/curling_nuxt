<template>
    <div class="linescore-page-container__wrap" :class="{'two-row': !slots.title && !slots.subtitle}">
        <div class="row  justify-center full-width" v-if="slots.title || slots.subtitle">
            <div class="column items-center">
                <h2
                    class=" title q-px-md q-pb-none text-center"
                    style="white-space: nowrap"
                >
                    <slot name="title" />
                </h2>
                <div class="text-center subtitle">
                    <slot name="subtitle" />
                </div>
            </div>
        </div>

        <div class="full-width">
          <slot name="content"/>
        </div>
        <div class="row justify-center items-start">
            <q-btn
                icon="check_circle"
                :style="{color: disabled ? '' : getColor('mint')}"
                size="50px"
                flat
                round
                dense
                @click="emit('next')"
                :disable="disabled"
            />
        </div>
 
    </div>
</template>
<style lang="scss" scoped>
.linescore-page-container__wrap {
    width: 100%;
    min-height: 100%;
    display: grid;
    padding-top: 60px;
    grid-template-rows: auto 1fr 25%;
    position: relative;
    &.two-row {
        grid-template-rows: auto 25%;
    }
    .title {
        @include lg-text;
        padding: 0px var(--space-xxs);
    }
    .subtitle {
        padding: 0px var(--space-md);
    }
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";
import Team from "@/store/models/team";

const { toggleLineScore, toggleGlobalSearch } = useDialogStore();

const props = defineProps({
    disabled: Boolean,
    
});

const {getColor} = useColor()

const emit = defineEmits(["next"]);

const slots = useSlots();
</script>
<script>
export default {
    name: 'LinescorePageContainer'
}
</script>
