<template>
    <div
        class="team-card__container column clickable"
        ref="container"
        :class="{ dense }"
        :style="`background-image: url(${avatar})`"
        
    >
        <div class="underlay">
            <div ref="top" class="border--top" :id="`top-${uniqueId}`"/>
            <div ref="left" class="border--left" :id="`left-${uniqueId}`"/>
                 <div ref="right" class="border--right" :id="`right-${uniqueId}`"/>
                     <div ref="bottom" class="border--bottom" :id="`bottom-${uniqueId}`"/>
        </div>
        <div class="overlay" ref="overlay">
            <div
                class="content-container full-height"
              
            >
                <div class="column justify-between" style="max-width: inherit">
                    <div
                        class="name "
                        :class="{ dense, 'full-width': width <= 200 }"
                       
                    >
                        <h2 class="text-uppercase text-bold " style="width: fit-content" >
                            <!-- {{ team?.name }} -->
                            <span class="clickable" v-for="word, i in team?.name?.split(' ')" :class="{'truncate': word.length > 10}" :key="i"  @click="navigateTo(`/teams/${teamId}`)">{{`${word} `}} </span>
                        </h2>

                        <h3 class="text-xs">{{ rink?.name }}</h3>
                    </div>
                    <div class="row no-wrap justify-between">
                        <div class="row badges" v-if="isLoadingTeam">
                            <q-skeleton
                                :height="dense ? '1.2em' : '2em'"
                                :width="dense ? '1.2em' : '2em'"
                                type="circle"
                                v-for="i in Array.from(Array(3).keys())"
                                :key="i"
                            ></q-skeleton>
                        </div>

                        <div
                            class="row badges items-center"
                            :class="{ 'no-wrap': dense }"
                            v-if="!isLoadingTeam && team && team?.badges"
                            ref="badges"
                        >
                            <Badge
                                v-for="badge in badges"
                                :key="badge.id"
                                :badge="badge"
                                :iconHeight="iconHeight"
                                iconOnly
                                @click.stop
                            />
                            <div
                                v-if="
                                    dense &&
                                    badges?.length !== team.badges?.length
                                "
                                class="showmore-badges__text"
                            >
                                +{{
                                    (team.badges?.length ?? 0) -
                                    (badges?.length ?? 0)
                                }}
                            </div>
                        </div>
                        <div
                            class="win-container column items-end"
                            :class="{ dense }"
                            ref="winContainer"
                            v-if="width <= 200"
                        >
                            <q-skeleton
                                :height="dense ? '1.3em' : '2em'"
                                :width="dense ? '40px' : '75px'"
                                v-if="isLoadingTeam"
                            />
                            <div class="text-bold wins text-right" v-else>
                                <span v-if="team?.totalStats?.wins_average">
                                    {{
                                        (
                                            team?.totalStats?.wins_average * 100
                                        ).toFixed()
                                    }}%
                                </span>
                                <span v-else>0</span>
                            </div>
                            <q-skeleton
                                :height="dense ? '1em' : '1em'"
                                :width="dense ? '30px' : '40px'"
                                v-if="isLoadingTeam"
                            />
                            <div
                                v-else
                                class="text-right wins-append"
                                style="margin-top: -8px"
                            >
                                <span v-if="team?.totalStats?.wins_average"
                                    >wins</span
                                >
                                <span v-else>games</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="win-container column items-end"
                    :class="{ dense }"
                    ref="winContainer"
                    v-if="width > 200"
                >
                    <q-skeleton
                        height="2em"
                        width="75px"
                        v-if="isLoadingTeam"
                    />
                    <div class="text-bold wins text-right" v-else>
                        <span v-if="team?.totalStats?.wins_average">
                            {{
                                (
                                    team?.totalStats?.wins_average * 100
                                ).toFixed()
                            }}%
                        </span>
                        <span v-else>0</span>
                    </div>
                    <q-skeleton
                        height="1em"
                        width="40px"
                        v-if="isLoadingTeam"
                    />
                    <div
                        v-else
                        class="text-right wins-append"
                        style="margin-top: -8px"
                    >
                        <span v-if="team?.totalStats?.wins_average">wins</span>
                        <span v-else>games</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.team-card__container {
    color: white;

    min-height: 120px;
    .content-container {
        display: grid;
        grid-template-columns: 1fr auto;
        max-width: v-bind(containerWidth);
    }
    &.dense {
        min-height: unset;
        .overlay {
            flex-grow: 1
        }
    }
    .name {
        letter-spacing: 0.001em;
        font-size: v-bind(nameFontSize);
        line-height: v-bind(nameLineHeight);
        width: auto;
        padding: 8px;
        max-width: v-bind(maxNameWidth);
       
        .truncate {
            max-width: inherit;
            text-overflow: ellipsis;
            white-space: nowrap;
            min-width: 0;
            width: v-bind(maxNameWidth);
            display: block;
            overflow: hidden;
        }
        &:not(.full-width) {
            padding-right: 0px;
        }
        &.full-width {
            padding-bottom: 0;
        }

        overflow: hidden;
        margin-top: calc(-1 * var(--space-sm));
        h2 {
              display: -webkit-box;
                    -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        min-width: 0;
        max-width: inherit;
            
      
        }
        h3 {
            margin-top: -4px;
        }
        &.dense {
            max-width: v-bind(containerWidth);
            min-height: 25px;
            min-width: 0;
            overflow: hidden h2 {
                font-size: var(--text-lg);
                text-overflow: ellipsis;
                min-width: 0;
                overflow: hidden;
                width: 100%;
            }
            .truncate {
                width: 100%;
            }
            
        }
    }
    border-radius: 8px;
    // margin: var(--space-sm);
    box-shadow: $pretty-shadow;
    background-size: cover;
    background-position-y: center;
    position: relative;
    .win-container {
        font-family: $font-family-main;
        padding: 0px 8px;

        &:not(.full-width) {
            width: min-content;
        }


        .wins {
            line-height: v-bind(winLineHeight);
            font-size: v-bind(winFontSize);
        }


        .wins-append {
            font-size: v-bind(winAppendFontSize);
        }
    }
    .underlay {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: inherit;
        z-index: 0;

        .border--left,
        .border--top,
        .border--bottom,
        .border--right {
            position: absolute;
            background: transparent;
            width: 0px;
            height: 0px;

        }

        .border--left {
            left: 0;
            bottom: 0;
            height:100%;
            transform: scale(0);
            width: 4px;
        }
        .border--right {
            right: 0;
            top: 0;
            height:100%;
            transform: scale(0);
            width: 4px;
        }
        .border--top {
            top: 0;
            left: 0;
            height:4px;
            width: 100%;
            transform: scale(0);
        }
         .border--bottom {
            bottom: 0;
            right: 0;
            height:4px;
            transform: scale(0);
            width: 100%;
        }
    }

    .overlay {
        position: relative;
        min-height: inherit;
        margin: var(--space-sm) 0px;
        display: flex;
        flex-direction: column;
        max-width: 100%;
        flex-grow: 1
        
    }
    .badges {
        padding: 0px var(--space-xs);
        gap: var(--space-xs);
        .showmore-badges__text {
            font-size: v-bind(nameFontSize);
        }
    }
}
</style>
<script setup>
import Team from "@/store/models/team";
import Rink from "@/store/models/rink";
import { useQuery } from "@tanstack/vue-query";
import { useElementBounding } from "@vueuse/core";
import gsap from 'gsap'

const props = defineProps({
    animated: Boolean,
    dense: Boolean,
    teamId: Number,
});

const uniqueId = `id-${(Math.random() * 1000000000000).toFixed()}`;

const { sortBadges } = useBadge();
const { getTeamAvatar } = useAvatar();

const { getFullTeam } = useTeam();

const { isLoading: isLoadingTeam } = useQuery({
    queryKey: ["team", "page", props.teamId],
    queryFn: () => getFullTeam({ id: props.teamId }),
    refetchOnWindowFocus: false,
});

const team = computed(() =>
    useRepo(Team)
        .with("badges")
        .with("totalStats")
        .where("id", props.teamId)
        .first()
);

const rink = computed(() =>
    useRepo(Rink).where("id", team.value?.rink_id).first()
);

const { isLoading, data: avatar } = getTeamAvatar(team.value?.id, {
    enabled: !!team.value?.id,
});
const overlay = ref(null);
const { height: cardHeight } = useElementBounding(overlay);

const cardHeightPx = computed(() => `${cardHeight.value}px`);

const container = ref(null);
const { width } = useElementBounding(container);

const maxBadges = computed(() =>
    Math.floor(Math.min(width.value, 960) / 2 / 35)
);

const badges = computed(() => {
    const b = props.dense
        ? [...team.value.badges].splice(0, maxBadges.value)
        : team.value.badges;

    return b.sort(sortBadges);
});

const winContainer = ref(null);
const { width: winWidth } = useElementBounding(winContainer);

const maxNameWidth = computed(
    () => `calc(${width.value}px - ${winWidth.value}px)`
);

const containerWidth = computed(() => `${width.value}px`);

const winFontSize = computed(() => `min(calc(${width.value}px * 0.1), 50px)`);
const winAppendFontSize = computed(
    () => `min(calc(${width.value}px * 0.07), 20px)`
);
const winLineHeight = computed(() => `max(calc(${winFontSize.value}), 25px)`);
const nameFontSize = computed(() => {
     if (width.value > 600) {
        return '29px'
    }
    if (width.value > 300) {
        return "15px";
    }
   

    return `max(calc(${width.value}px * 0.04), 10px)`;
});
const nameLineHeight = computed(() => `calc(${nameFontSize.value} * 1.9)`);
const iconHeight = computed(() => `min(calc(${width.value}px * 0.08), 2em)`);

onMounted(() => {
    if (!props.animated || !isLoadingTeam.value) return;

    // const t2 = gsap.timeline({repeat: -1});

    // t2.to(container.value, {
    //     scale: 1.01 ,
    //     duration: 1
    // })
    // t2.to(container.value, {
    //     scale: 1,
    //     duration:1,
    // })
    // t2.duration(2)
    const tl = gsap.timeline({
        repeat: 0,
        yoyo:false,
});

const bgColor = "#ffc107";





// top
tl.fromTo(`#top-${uniqueId}`, 1, 
   {
    scale: 0, 
    backgroundColor: bgColor,
    immediateRender: false,
    autoRound: false,
   

   }, 
   {
    scale: 1, 
    backgroundColor: bgColor,
    transformOrigin: 'left',
   
   }
);

tl.add('top-right')

tl.fromTo(`#top-${uniqueId}`, 1, 
   {
    scale: 1, 
    backgroundColor: bgColor,
    
    autoRound: false,
   

   }, 
   {
    scale: 0, 
    backgroundColor: bgColor,
    transformOrigin: 'right',
    immediateRender: false,
   
   }, 'top-right'
);



tl.fromTo(`#right-${uniqueId}`, 1, 
   {
    scale:0, 
    backgroundColor: bgColor,
    
    autoRound: false,
   }, 
   {
    scale: 1, 
    backgroundColor: bgColor,
     transformOrigin: 'top',
     immediateRender: false,
    
   }, 'top-right'
);

tl.add('right-bottom')


tl.fromTo(`#right-${uniqueId}`, 1, 
   {
    scale:1, 
    backgroundColor: bgColor,
   
    autoRound: false,
   }, 
   {
    scale: 0,
    backgroundColor: bgColor,

     transformOrigin: 'bottom',
      immediateRender: false,
    
   }, 'right-bottom'
);

// right


// bottom
tl.fromTo(`#bottom-${uniqueId}`, 1, 
   {
    scale:0, 
    background: bgColor,
    
    autoRound: false,

   }, 
   {
    scale:1, 
    background: bgColor,
     transformOrigin: 'right',
     immediateRender: false,
   }, 'right-bottom'
);

tl.add('bottom-left')

tl.fromTo(`#bottom-${uniqueId}`, 1, 
   {
    scale:1, 
    background: bgColor,
  
    autoRound: false,

   }, 
   {
    scale:0, 
    background: bgColor,

     transformOrigin: 'left',
       immediateRender: false,
   }, 'bottom-left'
);

// left
tl.fromTo(`#left-${uniqueId}`, 1, 
   {
    scale:0, 
    background: bgColor,
   
    autoRound: false,
   }, 
   {
    scale:1, 
    background: bgColor,
    transformOrigin: 'bottom',
     immediateRender: false,
   }, 'bottom-left'
);

tl.fromTo(`#left-${uniqueId}`, 1, 
   {
    scale:1, 
    background: bgColor,
    
    autoRound: false,
   }, 
   {
    scale:0, 
    background: bgColor,
    transformOrigin: 'top',
    immediateRender: false,
   }
);

tl.duration(1)

})
</script>
<script>
export default {
    name: "TeamCard",
};
</script>
