<template>
    <header class="game__header">
        <slot name="prepend"/>
        <nav class="row no-wrap justify-center full-width items-center" v-if="!hideValues.includes('details')">
            <div>
                <h2 class="text-sm text-center">Game</h2>
                <h1 class="text-md text-bold text-center" >
                    {{
                        format(
                            toTimezone(selections.start_time),
                            "MMMM DD, YYYY"
                        )
                    }}
                </h1>
                <h2 class="text-sm text-center">
                    {{ format(toTimezone(selections.start_time), "HH:mm a") }}
                </h2>
            </div>
        </nav>
        <div
            class="row no-wrap justify-between col-12"
            style="position: relative"
        >
            <div
                class="end-count__container"
                v-if="!hideValues.includes('score')"
            >
                {{ `After ${endCount}` }}
            </div>
            <div
                class="column team__header items-center"
                :class="hideValues.includes('away') ? 'col-12' : 'col-6'"
            >
                <div
                    class="avatar__container q-mb-md"
                    @click="emit('avatarClick', 'home')"
                >
                    <TeamAvatar
                        :teamId="selections.home?.id"
                        :color="
                            hideValues.includes('colors')
                                ? null
                                : selections.homeColor
                        "
                        :viewable="!!selections.home.id && !static"
                        :animateRing="
                            selectionMode === 'colors' &&
                            !hideValues.includes('colors')
                        "
                        :highlight="selectionMode === 'home'"
                    />
                    <div
                        class="hammer-container bg-primary"
                        :class="{ 'animated help--highlight help--animation': selectionMode === 'hammer', 'bg-primary': 
                            selections.hammerFirstEndTeam ===
                                selections.home?.id,
                                'bg-grey-4':  selections.hammerFirstEndTeam !==
                                selections.home?.id, }"
                        v-if="
                        selectionMode === 'hammer' || 
                            (!hideValues.includes('hammer') &&
                            !!selections.hammerFirstEndTeam &&
                            selections.hammerFirstEndTeam ===
                                selections.home?.id)
                        "
                    >
                        <q-icon name="hardware" :color="selections.hammerFirstEndTeam ===
                                selections.home?.id ? 'white' : 'grey-9'" />
                    </div>
                </div>

                <div class="column items-center full-width">
                    <div class="text-sm">Team</div>
                    <h2
                        class="text-sm text-bold text-center truncate-text full-width"
                    >
                        {{ selections.home.name }}
                    </h2>
                </div>
                <div
                    class="score__container"
                    v-if="!hideValues.includes('score')"
                >
                    {{ homePoints ?? 0 }}
                </div>
            </div>
            <div
                class="column team__header items-center col-6"
                v-if="!hideValues.includes('away')"
            >
                <div
                    class="avatar__container q-mb-md"
                    @click="emit('avatarClick', 'away')"
                >
                    <TeamAvatar
                        :teamId="selections.away?.id"
                        :color="
                            hideValues.includes('colors')
                                ? null
                                : selections.awayColor
                        "
                        :viewable="!!selections.away.id && !static"
                        :animateRing="
                            selectionMode === 'colors' &&
                            !hideValues.includes('colors')
                        "
                            :highlight="selectionMode === 'away'"
                    />
                    <div
                        class="hammer-container"
                        :class="{ 'animated help--highlight help--animation': selectionMode === 'hammer', 'bg-primary': 
                            selections.hammerFirstEndTeam ===
                                selections.away?.id,
                                'bg-grey-4':  selections.hammerFirstEndTeam !==
                                selections.away?.id, }"
                        v-if="
                        selectionMode === 'hammer' || 
                           ( !hideValues.includes('hammer') &&
                            !!selections.hammerFirstEndTeam &&
                            selections.hammerFirstEndTeam ===
                                selections.away?.id)
                        "
                    >
                        <q-icon name="hardware" :color="selections.hammerFirstEndTeam ===
                                selections.away?.id ? 'white' : 'grey-9'" />
                    </div>
                </div>

                <div class="column items-center full-width">
                    <div class="text-sm">Team</div>
                    <div style="position: relative" class="full-width">
                        <div
                            class="verified__container"
                            v-if="selections.verified"
                        >
                            <q-icon
                                name="verified"
                                :color="
                                    selections.verified ? 'primary' : 'grey-5'
                                "
                            />
                        </div>
                        <slot name="awayName">
                        <h2
                            class="text-sm text-bold text-center truncate-text"
                            style="white-space: nowrap"
                        >
                            {{ selections.away.name }}
                        </h2>
                        </slot>
                    </div>
                </div>
                <div
                    class="score__container"
                    v-if="!hideValues.includes('score')"
                >
                    {{ awayPoints ?? 0 }}
                </div>
            </div>
        </div>
        <div class="linescore-container"    v-if="!(hideValues.includes('linescore') && hideValues.includes('linescoreHeader'))">
            <div class="row justify-between items-end q-my-sm" v-if="!hideValues.includes('linescore')">
                    <div class="row items-center">
                        <q-icon
                            name="o_scoreboard"
                            color="deep-purple"
                            class="text-md q-mr-sm"
                        />
                        <h2 class="text-md text-bold">Linescore</h2>
                    </div>
                </div>
                <q-separator />
         <LinescoreGridView
      
                ref="nav"
                :game="selections"
                :endCount="endCount"
                :score="score"

               
             
                :colorCode="false"
                :headerOnly="hideValues.includes('linescore')"
            >
                    <template v-slot:prependHeader v-if="selectionMode === 'endcount'">
               <q-btn round icon="remove" dense color="primary" class="help--animation help--highlight" @click="emit('update:endCount', -2)"/>
        </template>
        <template v-slot:appendHeader v-if="selectionMode === 'endcount'">
            <q-btn round icon="add" dense color="primary" class="help--animation help--highlight" @click="emit('update:endCount', 2)"/>
        </template>
  
         </LinescoreGridView>
        </div>
    </header>
</template>
<style lang="scss" scoped>
.game__header {
    padding: 0px var(--space-md);
    nav {
        padding: var(--space-sm) 0px;
        margin-bottom: var(--space-md);
    }
    h1 {
        text-align: center;
    }
    .team__header {
        .avatar__container {
            height: 7em;
            max-width: 100%;
            width: 7em;
            position: relative;
            .hammer-container {
                position: absolute;
                bottom: -1;
                right: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 6px;
                border-radius: 50%;
                font-size: 1.2em;
                border: 1px solid rgba(0, 0, 0, 0.3);
                &:not(.animated) {
                    box-shadow: $pretty-shadow-2;
                }
               
                
            }
        }
        .score__container {
            font-size: 4em;
            position: relative;
        }
    }
    .end-count__container {
        position: absolute;
        bottom: 1em;
        left: 0;
        right: 0;
        margin: auto;
        width: fit-content;
        color: $grey-8;
        font-size: 0.8em;
    }
    .linescore-container {
        margin-top: var(--space-sm)
    }
}
</style>
<script setup>
const props = defineProps({
    awayPoints: Number,
    homePoints: Number,
    endCount: Number,
    game: Object,
    hideValues: {
        type: Array,
        default: [],
    },
    modelValue: Object,
    selectionMode: String,
    score: Object,
    static: Boolean,
});

const emit = defineEmits(["avatarClick", 'update:endCount', "update:modelValue"]);

const selections = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});
const $q = useQuasar();
const { format, toTimezone } = useTime();
</script>
