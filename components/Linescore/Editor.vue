<template>
    <div
        class="linescore-editor__container hide-scroll" >
        <LinescoreGrid2
            :editedScore="score"
            v-if="isMounted"
            :selected="selected"
            ref="linescoreContainer"
            @select="onGridSelect"
            :inverted="inverted"
        >
            <template v-slot:headerPrepend>
               <slot name="scorePrepend"/>
            </template>
            <template v-slot:avatarHome>
                <div class="nested-avatar__container">
                    <LinescoreAvatar
                        avatarSize="100%"
                        v-model="selections.home"
                        :hasHammer="
                            selections.hammerFirstEndTeam ===
                            selections.home?.id
                        "
                        :color="selections.homeColor || selections?.home?.color"
                    />
                </div>
            </template>
            <template v-slot:avatarAway>
                <div class="nested-avatar__container">
                    <LinescoreAvatar
                        avatarSize="100%"
                        v-model="selections.away"
                        :hasHammer="
                            selections.hammerFirstEndTeam ===
                            selections.away?.id ||
                            !selections.hammerFirstEndTeam
                        "
                          :color="selections.awayColor || selections?.away?.color"
                    />
                </div>
            </template>

           
        </LinescoreGrid2>
        <div
            class="slot-content"
            :style="{ height: slotHeight }"
          
        >
            <slot />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.linescore-editor__container {
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    overflow-y: visible;
    box-sizing: border-box;
    padding-top: var(--space-md);
    .avatars-unnested__container {
        display: grid;
        grid-template-columns: repeat(2, 45%);
        column-gap: 10%;
    }
    .avatars-unnested__container {
        width: 100%;
        box-sizing: border-box;

        &.visible {
            // padding: var(--space-md);
            padding-bottom: 0px;
        }

        .avatar-unnested__away,
        .avatar-unnested__home {
            .team__header {
                margin: auto;
                box-sizing: border-box;
                grid-column: 1/3;
            }
        }
    }
    .nested-avatar__container {
        padding: 10%;
        // height: 75%;
    }


    .end-count__container {
        position: absolute;
        bottom: 1em;

        margin: auto;
        left: 0;
        right: 0;
        width: fit-content;
        height: fit-content;
    }
    .edit--floating {
        position: absolute;
        right: -2em;
        top: 0;
        bottom: 0;
        margin: auto;
        height: fit-content;
    }
    .info__section {
        display: flex;
        justify-content: center;
        .q-icon {
            margin-right: var(--space-xxxs);
        }
    }
    .sheet__number {
        padding: var(--space-xs);
        border: 1px solid rgba(0, 0, 0, 0.2);
        margin: var(--space-xs);
        text-align: center;
        border-radius: 4px;
        width: calc(2ch + var(--space-xs) * 2);
        transition: transform 0.1s;
        height: fit-content;
        &.selected {
            color: white;
            background-color: $deep-purple;
            transform: scale(1.1);
            font-weight: bold;
        }
    }
}
</style>

<script setup>
import {
    useMounted,
    useRefHistory,
    useVModel,
    useElementSize,
    useEventListener,
} from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

const props = defineProps({
    canEdit: Boolean,
    canViewTeams: Boolean,
    inverted: Boolean,
    score: Object,
    selected: Number,
    selections: Object,
    showVerified: {
        type: Boolean,
        default: false,
    },
    static: Boolean,
});

const emit = defineEmits([

    "scroll",

]);

const { toggleGlobalSearch } = useDialogStore();

const userTeamStore = useUserTeamStore();

const isMounted = useMounted();

const endCount = computed(() => Object.keys(props.score)?.length ?? 0);





const linescoreContainer = ref(null);
const { height: linescoreContainerHeight } = useElementSize(linescoreContainer);

const slotHeight = computed(
    () => `calc(100% - ${linescoreContainerHeight.value}px)`
);


const onGridSelect = (e) => {
    emit("scroll", e);
};
</script>

<script>
export default {
    name: "LinescoreEditor",
};
</script>
