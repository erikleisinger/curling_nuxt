<template>
    <div class="game-result__container" :class="{ verified: isVerified }">
        <div class="verified__container" v-if="isVerified">
            <div class="verified__badge">Verified</div>
        </div>
        <div
            class="bg"
            :style="{ backgroundImage: `url(${backgroundImage})` }"
        />
        <div
            class="avatar-container"
            :style="{ backgroundImage: `url(${homeAvatar})` }"
        />

        <div
            class="avatar-container"
            :style="{ backgroundImage: `url(${awayAvatar})` }"
        />
        <div class="info-container">
            <div class="team-name row items-center q-pl-sm" :class="{placeholder: home.id > 100000000}">
                <div>{{ home.name }}</div>
                <div class="show-more__team left"  @click="showHomeTeam">
                    <div class="q-ml-lg">View team</div>
                </div>
            </div>
            <div
                class="team-name row items-center justify-end q-pr-sm"
                style="text-align: right"
                :class="{placeholder: away.id > 100000000}"
            >
                <div>{{ away.name }}</div>
                <div class="show-more__team right" @click="showAwayTeam" >
                    <div class="q-mr-lg">View team</div>
                </div>
            </div>

            <div class="score">
                <div class="score-inner row justify-around items-center">
                    <div>{{ home.points_scored }}</div>
                    <div>:</div>
                    <div>{{ away.points_scored }}</div>
                </div>
                <div class="show-more__game" @click="viewGame">
                    <div>View game</div>
                </div>
                <div class="divider" />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$border-color: rgba(0, 16, 158, 1);
$clip-path: polygon(25% 100%, 75% 100%, 100% 0%, 0% 0%);
$verified-color: rgb(247, 190, 0);
$border-radius: 8px;
.game-result__container {
    display: grid;
    grid-template-columns: repeat(2, 50%);

    position: relative;

    max-width: 600px;
    aspect-ratio: 4/1;

    &.verified {
        border-top-left-radius: $border-radius;
        border-top-right-radius: $border-radius;
    }

    .verified__container {
        position: absolute;
        width: 100%;
        height: 6px;
        background-color: $verified-color;
        top: 0;
        left: 0;
        z-index: 2;
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        .verified__badge {
            width: fit-content;
            height: 22px;
            position: absolute;
            border-radius: 8px;
            padding: 2px 10px;
            top: -8px;
            background-color: $verified-color;
            right: 0;
            left: 0;
            margin: auto;
            text-align: center;
            font-size: var(--text-sm);
            font-weight: bold;
        }
    }

    .bg {
        position: absolute;
        height: 100%;
        width: 100%;
        -webkit-filter: grayscale(100%);
        filter: grayscale(100%);
        background-position: 0% 100%;
         border-radius: inherit;
    }
    &:after {
        content: "";
        position: absolute;
        height: 100%;
        width: 100%;
        background: v-bind(backgroundGradient) !important;
         border-radius: inherit;
    }

    .avatar-container {
        position: relative;
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        background-blend-mode: multiply;
        -webkit-filter: grayscale(100%);
        border-radius: inherit;
        filter: grayscale(100%);

        &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }
    }
    .info-container {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        z-index: 1;
        color: white;
         border-radius: inherit;

        .team-name {
            font-weight: bold;
            font-size: min(1.5em, 10vw);
            text-transform: uppercase;
            word-spacing: 10000px;
            // padding: var(--space-xs);
            // &:nth-child(3) {
            //     text-align: right;
            // }
            // color: rgb(107, 0, 0);
            mix-blend-mode: multiply;
            // color: rgb(75, 0, 0);
            .show-more__team {
                     cursor: pointer;
                font-size: 0px;
                position: absolute;
                height: 100%;
                width: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                opacity: 0;
                width: 50%;
                transition: opacity 0.2s;
                display: flex;
                justify-content: center;
                align-items: center;

                &.left {
                    left: 0;
                    clip-path: polygon(0% 0%, 59% 0%, 79% 100%, 0% 100%);
                }
                &.right {
                    right: 0;
                    clip-path: polygon(41% 0%, 100% 0%, 100% 100%, 22% 100%);
                }
            }
            &:not(.placeholder) {
                &:hover {
                    font-size: 0px;
                    .show-more__team {
                    font-size: 24px !important;
                    opacity: 1;
                }
                }
            }
       
        }

        .score-inner {
            height: 100%;
            width: 90%;
            position: absolute;
            background-color: white;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            clip-path: $clip-path;
            z-index: 1;
            color: rgba(255, 255, 255, 0.9);
            background-color: rgba(0, 0, 0, 0.1);
            font-weight: bold;
            padding: 0px 24px;
        }
        .score {
            font-size: 3em;
            padding: 0px 8px;
            height: 100%;
            aspect-ratio: 5/3;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            .divider {
                width: 0px;
                background-color: rgba(0, 0, 0, 0.4);
                height: 100%;
                position: absolute;
                left: 0;
                right: 0;
                margin: auto;
            }

            background-color: rgba(0, 0, 0, 0.1);
            clip-path: $clip-path;
            .show-more__game {
                cursor: pointer;
                clip-path: $clip-path;
                position: absolute;
                height: 100%;
                width: 100%;
                background-color: red;
                opacity: 0;
                left: 0;
                top: 0;
                background-color: rgba(0, 0, 0, 0.5);

                transition: opacity 0.2s;
                display: flex;
                justify-content: center;
                align-items: center;
                word-spacing: 10000px;
                text-align: center;

                font-size: 0px;
                text-transform: uppercase;
                font-weight: bold;
                z-index: 1;
            }
            &:hover {
                font-size: 0px;
                .show-more__game {
                    opacity: 1;
                    font-size: min(24px, 10vw);
                }
            }
        }
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
import { useQuery } from "@tanstack/vue-query";
import backgroundImage from "@/assets/rink.jpg";

const $q = useQuasar();

const dialogStore = useDialogStore();

const { toggleGlobalSearch } = dialogStore;

const props = defineProps({
    authorized: Boolean,
    home: Number,
    notify: {
        type: Boolean,
        default: true,
    },
    gameId: Number,
});

const away = computed(() => {
    const t = useRepo(GameTeam)
        .with("team")
        .where("team_id", (val) => val !== props.home)
        .where("game_id", props.gameId)
        .first() ?? { name: "Unnamed team" };
    return {
        ...t,
        ...(t.team ?? {}),
        isPlaceholder: t.isPlaceholder,
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
        isPlaceholder: t.isPlaceholder,
    };
});

const colors = {
    blue: "55, 144, 233",
    red: "229, 55, 52",
    yellow: "251, 192, 45",
};

const GRADIENT_OPACITY = 0.75;

const backgroundGradient = computed(() => {
    return `linear-gradient(270deg, rgba(${
        colors[home.value.color]
    },${GRADIENT_OPACITY}) 0%, rgba(${
        colors[away.value.color]
    },${GRADIENT_OPACITY}) 100%)`;
});

const homeAvatarEnabled = computed(() => !!home.value.avatar_url);
const { isLoading: homeAvatarLoading, data: homeAvatar } = useQuery({
    queryKey: ["avatar", "team", home.value.avatar_url],
    queryFn: async () => {
        const { data, error } = await useSupabaseClient()
            .storage.from("Avatars")
            .download(home.value.avatar_url);
        return URL.createObjectURL(data);
    },
    enabled: homeAvatarEnabled.value,
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
    staleTime: Infinity,
});

const awayAvatarEnabled = computed(() => !!away.value.avatar_url);
const { isLoading: awayAvatarLoading, data: awayAvatar } = useQuery({
    queryKey: ["avatar", "team", away.value.avatar_url],
    queryFn: async () => {
        const { data, error } = await useSupabaseClient()
            .storage.from("Avatars")
            .download(away.value.avatar_url);
        return URL.createObjectURL(data);
    },
    enabled: awayAvatarEnabled.value,
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
    staleTime: Infinity,
});

const isVerified = computed(
    () => useRepo(Game).withAll().where("id", props.gameId).first()?.isVerified
);

const viewGameConf = ref(false)

const viewGame = () => {
    if ($q.platform.is.mobile && !viewGameConf.value) {
        viewGameConf.value = true;
    } else {
            viewGameConf.value = false;
 return navigateTo(`/games/view/${props.gameId}`)
    }
   
}

const showHomeConf = ref(false)

const showHomeTeam = () => {
        // Prevent showing teams that are placeholders/null
    if (home.value.id > 100000000) return;
     if ($q.platform.is.mobile && !showHomeConf.value) {
        showHomeConf.value = true;
    } else {
            showHomeConf.value = false;
 return navigateTo(`/teams/${home.value.id}`)
    }
}

const showAwayConf = ref(false)

const showAwayTeam = () => {
    // Prevent showing teams that are placeholders/null
      if (away.value.id > 100000000) return;
     if ($q.platform.is.mobile && !showAwayConf.value) {
        showAwayConf.value = true;
    } else {
            showAwayConf.value = false;
 return navigateTo(`/teams/${away.value.id}`)
    }
}

const emit = defineEmits(["expand", "invite"]);

const { format, toTimezone } = useTime();
</script>
