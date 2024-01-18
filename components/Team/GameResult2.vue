<template>
<div class="game-result__container row">
    <div class="game-result__container--inner">
        <!-- <div class="floating">
            <q-btn round icon="open_in_new" color="white" text-color="gray" dense size="0.7em">
               
            </q-btn>
        </div> -->
        <div class="separator"/>
        <div
            class="team-row"
            
        >
        <!-- :style="{ order: home.points_scored > away.points_scored ? 0 : 1 }" -->
            <h3 class="team-name">
                
                {{ home.name }}
                <q-icon
                    name="verified"
                    class="win-marker"
                    v-if="home.points_scored > away.points_scored"
                />
            </h3>
            <div class="row items-center" style="gap: 8px">
                <h3 class="score">
                    {{ home.points_scored }}
                </h3>
                <div class="avatar-container">
                    <TeamAvatar
                        :teamId="home.id"
                        :color="home.color"
                        animateRing
                    />
                </div>
            </div>
        </div>
        <div
            class="team-row"
         
        >
           <!-- :style="{ order: away.points_scored > home.points_scored ? 0 : 1 }" -->
            <h3 class="team-name">
               
                {{ away.name }}
                 <q-icon
                    name="verified"
                    class="win-marker"
                    v-if="away.points_scored > home.points_scored"
                />
            </h3>
            <div class="row items-center" style="gap: 8px">
                <h3 class="score">
                    {{ away.points_scored }}
                </h3>
                <div class="avatar-container">
                    <TeamAvatar
                        :teamId="away.id"
                        :color="away.color"
                        animateRing
                    />
                </div>
            </div>
        </div>

    </div>
    <div class="view-more">
        <div class="float">
          <q-btn round icon="open_in_new" color="white" dense flat size="0.7em" @click="navigateTo(`/games/view/${game.id}`)">
               
            </q-btn>
        </div>
    </div>

</div>
</template>
<style lang="scss" scoped>
.game-result__container {
    overflow: hidden;
padding: 0px var(--space-md);
padding-right: 0px;
    border-radius: 16px;
    min-height: 80px;
    box-shadow: $pretty-shadow;
         position: relative;
        margin: var(--space-sm);
           .view-more {
        height: 100%;
        width: 45px;
        display: flex;
        align-items: center;
        // margin: auto;
 
    overflow: hidden;
      .float {
        position: absolute;
        top: 0;
        bottom: 0;
        width: inherit;
        background-color: $app-slate;
        display: flex;
        align-items: center;
        justify-content: center;
      }
       
    }
}
.game-result__container--inner {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
   flex-grow: 1;
   padding-right: var(--space-sm);
    


    position: relative;
    background-color: white;

    .team-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-md);
        padding: var(--space-xxxs) 0px;
    }
    .score {
        @include md-text;
    }
    .avatar-container {
        width: 1.5em;
        position: relative;
    }
    .win-marker {
        color: #00c49a;
    }
    .separator {
        position: absolute;
        left: 0;
        right: var(--space-xs);
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.1);
        height: 1px;
        margin: auto;
    }
    .floating {
        position: absolute;
        top: 0;
        bottom: 0;
        height: fit-content;
        margin: auto;
        // right: 0;
        // left: -12px;
        right: -12px;
        width: fit-content;
    }
 
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { useGameRequestStore } from "@/store/game-requests";
import { numberToLetter } from "@/utils/sheets";
import GameTeam from "@/store/models/game-team";
import Team from "@/store/models/team";
import Game from "@/store/models/game";
import Rink from "@/store/models/rink";
import Sheet from "@/store/models/sheet";

import { useQueryClient } from "@tanstack/vue-query";

const props = defineProps({
    home: Number,
    gameId: Number,
    search: String,
    showRink: {
        type: Boolean,
        default: true,
    },
    viewHome: {
        type: Boolean,
        default: true,
    },
    viewAway: {
        type: Boolean,
        default: true,
    },
});

const queryClient = useQueryClient();

const refreshQuery = () => {
    queryClient.invalidateQueries({
        queryKey: ["team", "games", home.value?.id],
    });
};

const gameResult = ref(null);

const highlightColor = ref("#B4FFEB");

const highlight = (val) => {
    const highlightables = gameResult.value.querySelectorAll(".highlightable");
    let regex;
    if (!!val) {
        regex = new RegExp(val.toLowerCase(), "i");
    }

    Array.from(highlightables).forEach((el) => {
        el.innerHTML = el.innerText.replaceAll("\n", "");
        if (!val) return;

        el.innerText.match(regex)?.forEach((match) => {
            const newhtml = el.innerHTML.replace(
                match,
                `<span style="background-color: ${highlightColor.value}">${match}</span>`
            );

            el.innerHTML = newhtml;
        });
    });
};

watch(
    () => props.search,
    (val) => {
        if (!val) return;
        nextTick(() => {
            highlight(val);
        });
    },
    { immediate: true }
);

const { truncateWords } = useText();

const $q = useQuasar();

const dialogStore = useDialogStore();

const { toggleGlobalSearch } = dialogStore;

const away = computed(() => {
    const t = useRepo(GameTeam)
        .with("team")
        .where("team_id", (val) => val !== props.home)
        .where("game_id", props.gameId)
        .orderBy("team_id", "asc")
        .first() ?? { name: "Unnamed team" };
    return {
        ...t,
        ...(t.team ?? {}),
        name: t.placeholder ? t.placeholder : t.team?.name,
    };
});
const home = computed(() => {
    const t = useRepo(GameTeam)
        .withAll()
        .where("team_id", (val) => val === props.home)
        .where("game_id", props.gameId)
        .first() ?? { name: "Unnamed team" };
    return {
        ...t,
        ...(t.team ?? {}),
        
    };
});

const { getColor, getEventColor } = useColor();

const gradient = computed(
    () =>
        `linear-gradient(90deg, rgba(${getEventColor(
            home.value.color
        )}, 0.8) 0%, rgba(${getEventColor(away.value.color)}, 0.8) 100%)`
);

const game = computed(() =>
    useRepo(Game).withAll().where("id", props.gameId).first()
);

const isUpcoming = computed(() => game.value?.id >= 1000000000);

const rink = computed(() =>
    !game.value?.rink_id
        ? null
        : useRepo(Rink).where("id", game.value.rink_id).first()
);

const sheet = computed(() =>
    !game.value?.sheet_id
        ? null
        : useRepo(Sheet).where("id", game.value.sheet_id).first()
);

const emit = defineEmits(["expand"]);

const { format, toTimezone } = useTime();

const { isOnTeam } = useTeam();
</script>
