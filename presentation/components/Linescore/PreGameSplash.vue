<template>
<LinescorePageContainer @next="emit('next')">
    <template v-slot:content>
    <div class="pre-game__container">
        <div class="pre-game__wrap">
            <div class="column team-container home">
                <h2
                    class="text-lg  text-bold text-uppercase q-pb-sm text-italic team-name home"
                >
                <div>
                    {{ modelValue.home.name }}
                </div>
                </h2>
                <div class="avatar-container home">
                    <TeamAvatar
                        :teamId="modelValue.home.id"
                        :color="modelValue.homeColor"
                        class="avatar"
                    />
                    <GameHammerIndicator hasHammer v-if="
                            modelValue.hammerFirstEndTeam === modelValue.home.id
                        "/>
                </div>
            </div>
            <div
                class="column justify-center align-center text-xl text-bold text-uppercase text-italic text-center"
            >
                Vs
            </div>
            <div class="column justify-end no-wrap team-container away">
                <div class="avatar-container away">
                    <TeamAvatar
                        :teamId="modelValue.away.id"
                        :color="modelValue.awayColor"
                        class="avatar"
                    />
 
                    <GameHammerIndicator hasHammer v-if="
                            modelValue.hammerFirstEndTeam === modelValue.away.id
                        "/>
                </div>
                <h2
                    class="text-lg text-right text-bold text-uppercase q-pt-sm text-italic team-name away"
                >
                <div>
                    {{ modelValue.away.name }}
                </div>
                </h2>
            </div>
        </div>

        <div class="backsplash" />
    </div>
    </template>
</LinescorePageContainer>
</template>
<style lang="scss" scoped>
.pre-game__container {
    position: relative;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    width: 100%;
    .next-container {
        pointer-events: all;
    }
    .backsplash {
        position: absolute;
        top: -60px;
        bottom: 0;
        margin: auto;
        left: 0;
        right: 0;
        max-height: 300px;
        @include sm {
            max-height: 700px;
            top: 0;
        }
        background: v-bind(backsplashGradient);
        pointer-events: none;
    }
    .pre-game__wrap {
        display: grid;
        grid-template-columns: 125px auto 125px;
        padding: 0px var(--space-md);
        @include sm {
            grid-template-columns: 175px auto 175px;
            padding: 0px 20vw;
        }
        height: 100%;
        max-height: 450px;
        position: relative;

        max-width: 100vw;
        box-sizing: border-box;

        h2 {
            white-space: nowrap;
        }

        > div:not(.backsplash) {
            z-index: 1;
        }

        .avatar-container {
            position: relative;
            height: max-content;
            width: 100%;
            box-sizing: border-box;
            .avatar {
                height: fit-content;
                width: 100%;
            }

        }
    }
    .team-container {
        position: relative;
        .team-name {
            height: var(--text-lg);
            box-sizing: content-box;
            &.home {
                >div {
                    left: 0;
                }
            }
            &.away {
                >div {
                    right: 0;
                }
            }
            >div {
            position: absolute;
            width: 100vw;

            }
            
        }
    }
}
</style>
<script setup>
import gsap from "gsap";
const emit = defineEmits(["next"]);
const props = defineProps({
    modelValue: Object,
});

const $q = useQuasar();
onMounted(() => {
    const ease = "expo";
    const delay = 0;
    const duration = 1;
    const x = $q.screen.xs ? 500 : 1500;
    const xName = 100;
    gsap.from(".avatar-container.away", {
        x,
        duration,
        delay,
        ease,
    });
    gsap.from(".avatar-container.home", {
        x: -1 * x,
        duration,
        delay,
        ease,
    });
    gsap.from(".team-name.home", {
        x: -1 * xName,
        duration: 5,
        delay: 0,
        ease,
    });
    gsap.from(".team-name.away", {
        x: xName,
        duration: 5,
        delay: 0,
        ease,
    });
    gsap.from(".backsplash", {
        scaleY: 0,
        duration: 0.5,
        delay: 0.5,
        ease: "power",
        transformOrigin: "middle",
    });
});
//
const backsplashGradient = computed(() => {
    const colors = {
        yellow: "251, 192, 45",
        red: "229, 55, 52",
        blue: "55, 144, 233",
    };
    return `linear-gradient(
            5deg,
            rgba(${colors[props.modelValue.awayColor]}, 0) 10%,
           
            rgba(${colors[props.modelValue.awayColor]}, 0.6) 49%,
            rgba(${colors[props.modelValue.homeColor]}, 0.6) 51%,
            rgba(${colors[props.modelValue.homeColor]}, 0) 90%

        )`;
});
</script>
