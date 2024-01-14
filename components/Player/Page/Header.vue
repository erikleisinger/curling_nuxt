<template>
    <header class="player-page__header">
        <section name="avatar" class="avatar__section row">
            <div class="avatar-container" :class="{clickable: canEdit}" @click="onAvatarClick">
                <Avataaar v-bind="parseAvatar(player?.avatar)" />
            </div>
        </section>
        <section
            name="player info "
            class="column justify-center player-info__section"
        >
            <h1>{{ player?.first_name }}</h1>
            <h1>{{ player?.last_name }}</h1>
            <div class="row no-wrap items-center">
                <q-icon color="red" name="location_on" />
                <h2>{{ player?.rink?.name }}</h2>
            </div>
        </section>
    </header>
       <q-dialog v-model="editing" persistent v-if="canEdit">
            <q-card style="width: 100%">
                <AvataaarGenerator
                    role="main"
                    v-model="player.avatar"
                    @close="editing = false"
                />
            </q-card>
        </q-dialog>
</template>
<style lang="scss" scoped>
.player-page__header {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: var(--space-md);
    // color: white;
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
        h1 {
            @include lg-text;
            &:first-child {
                @include md-text;
            }
            line-height: 0.7;
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

const player = computed(() =>
    useRepo(Player).with("rink").where("id", props.playerId).first()
);


const editing = ref(false)
const onAvatarClick = () => {
    if (!props.canEdit) return;
    editing.value = true;
}
</script>
