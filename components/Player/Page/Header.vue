<template>
    <header class="player-page__header">
        <section name="avatar" class="avatar__section row items-center">
            <div class="avatar-container" :class="{clickable: canEdit}" @click="onAvatarClick">
                <Avataaar v-bind="parseAvatar(player?.avatar)" />
            </div>
        </section>
        <section
            name="player info "
            class="column justify-center player-info__section"
        >
            <h1>{{ player?.first_name }}</h1>
            <h1 >{{ player?.last_name }}</h1>
            <div class="row no-wrap " style="line-height:1">
                <q-icon color="red" name="location_on" />
                <h2>{{ player?.rink?.name ?? 'No home rink' }}</h2>
            </div>
        </section>
    </header>
   
</template>
<style lang="scss" scoped>
.player-page__header {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: var(--space-md);
    .avatar__section {
        justify-content: center;
        .avatar-container {
            width: 125px;
            @include sm {
                width: 200px;
            }
        }
    }
    .player-info__section {
        padding-top: 2em;
        max-width: 50%;
        h1 {
            @include lg-text;
            &:first-child {
                @include md-text;
            }
            line-height: 0.8;
            
            max-width: 100%;
            white-space: pre-wrap;

        }
    }
}
</style>
<script setup>
import Player from "@/store/models/player";
import { parseAvatar } from "@/utils/avatar";
const props = defineProps({
    canEdit: Boolean,
    playerId: String,
});

const emit = defineEmits(['editAvatar'])

const player = computed(() =>
    useRepo(Player).with("rink").where("id", props.playerId).first()
);


const editing = ref(false)
const onAvatarClick = () => {
    if (!props.canEdit) return;
    emit('editAvatar')
}
</script>
