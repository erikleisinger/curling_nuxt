<template>
      <q-card class="player-position-select__container no-wrap">
        <!-- <div class="check--floating">
            <q-btn icon="check"  flat round @click="emit('save')"/>
        </div> -->
           
        <header class="player-position__header--row column justify-center items-center">
            <div style="width: 60px">
                <Avataaar v-bind="parseAvatar(player?.avatar)"/>
            </div>
            <div class="name-text text-center">{{player?.first_name}} {{player?.last_name}}</div>
              
            <!-- <div class="player-position__header">
        <h2>Select position</h2>
        <h3>{{player.first_name}}</h3>
            </div> -->
        </header>
        <div class="row items-center justify-between no-wrap">
         <q-btn flat  icon="chevron_left" size="1.2em" dense @click="select(-1)" class="position-select__arrow"/>
  <div class="position-text text-center">{{selection ?? 'Member'}}</div>
            <q-btn flat  icon="chevron_right" size="1.2em" dense @click="select(+1)" class="position-select__arrow"/>
        </div>
            </q-card>
</template>
<style lang="scss" scoped>
    .player-position-select__container {
        color: white;
        background-color: $app-slate;
        @include chunky-border;
        border-radius: 12px;
        max-width: 175px;
        position: relative;
        .position-text {
            font-size: 1.3rem;
            font-family: $font-family-header;
            height: fit-content;

            text-align: center;
            margin-top: var(--space-xs);
            margin-bottom: var(--space-xxs);
            color: $app-blue;
             max-width: inherit;
        }
        .name-text {
             font-family: $font-family-header;
             @include smmd-text;
             display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                min-width: 0;
                max-width: 100%;
                width: inherit;
                text-align: center;
                position: relative;
                padding: 0px var(--space-md)


        }

    .check--floating {
        position: absolute;
        top:0;
        right: 0;
        color: $app-blue;
    }
    }
</style>
<script setup>
import {TEAM_POSITIONS} from '@/presentation/constants/team'
import {parseAvatar} from '@/utils/avatar'
import Player from '@/store/models/player'
    const props = defineProps({
        modelValue: String,
        playerId: String,
    })

    const emit = defineEmits(['save', 'update:modelValue']);

    const selection = computed({
        get() {
            return props.modelValue;
        },
        set(val) {
            emit('update:modelValue', val)
        }
    })

    const options = Object.values(TEAM_POSITIONS)

    const select = (inc) => {
        const currentSelection = options.findIndex(({value}) => value === selection.value);
        if (currentSelection === -1) {
            selection.value = options[0].value
        }
        if (inc > 0) {
            if (currentSelection >= options.length - 1) {
                selection.value = options[0].value
            } else {
               selection.value = options[currentSelection + 1].value
            }
        }
        if (inc < 0) {
            if (currentSelection === 0) {
                selection.value = options[options.length - 1].value
            } else {
                selection.value = options[currentSelection - 1].value
            }
        }
    }

    const player = computed(() => useRepo(Player).where('id', props.playerId).first())
</script>