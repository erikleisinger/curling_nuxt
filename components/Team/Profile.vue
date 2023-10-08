<template>
    <div class="row relative-position">
        <div class="edit--floating" v-if="canEdit && !create">
            <q-btn flat round :icon="editing ? 'close' : 'edit'" @click="editing = !editing"/>
        </div>
        <div class="row col-12 col-sm-6 profile__container">
            <div class="column team__header items-center col-12">
                <div class="avatar__container q-mb-sm">
                    <TeamAvatar
                        :teamId="teamId"
                        :viewable="false"
                        :editable="canEdit && editing"
                        @update="emit('update', { avatar: $event })"
                        :create="create"
                    />
                </div>

                <div class="column items-center">
                    <div class="text-sm" style="margin-bottom: -0.5em">Team</div>
                    <TeamName
                        :canEdit="canEdit && editing"
                        :teamId="teamId"
                        :create="create"
                        @update="emit('update', { name: $event })"
                    />
                </div>
                <div class="row q-mt-sm" v-if="!create">
                    <Badge badge="showoff" height="3em" class="q-mr-sm" />
                    <Badge badge="bulwark" height="3em" class="q-mr-sm" />
                    <Badge badge="firstend" height="3em" />
                </div>
            </div>
            <div
                v-if="showPlayers"
                class="col-12"
               
            >
                <div class="row items-center q-my-sm">
                    <h2 class="text-md text-italic">Roster</h2>
                </div>

                <q-separator class="q-mb-md"/>
                <TeamPlayerList
                    :teamId="teamId"
                    :showPending="canEdit"
                    :create="canEdit && create"
                    :editing="canEdit && editing"
                 
                    @loaded="emit('loaded')"
                />
            </div>
        </div>
        <div class="col-12 col-sm-6 attributes__container" v-if="!create">
            <div class="row items-center q-my-sm">
                <h2 class="text-md text-italic">Stats</h2>
            </div>

            <q-separator class="q-mb-md"/>

            <TeamAttributes :teamId="teamId" />
             <div style="width: calc(100%  + 16px); box-sizing: border-box; margin: 0px -8px" >
            <ChartTeamStatsTime :teamId="teamId" :visibleStats="['Hammer efficiency']"/>
        </div> 
        </div>
       
    </div>
</template>
<style lang="scss" scoped>
.edit--floating {
    position: absolute;
    top: 0;
    margin-top: var(--space-sm)
}
.attributes__container,
.profile__container {
    @include sm {
        padding: var(--space-sm);
    }
}

.team__header {
    padding: var(--space-lg);
    padding-bottom: var(--space-lg);
    .avatar__container {
        height: v-bind(avatarWidth);
        max-width: 100%;
        width: v-bind(avatarWidth);
    }
    .edit--floating {
        position: absolute;
        top: 0;
        right: -1.5em;
    }
}
</style>
<script setup>
const props = defineProps({
    avatarWidth: {
        type: String,
        default: "8em",
    },
    canEdit: Boolean,
    create: Boolean,
    showPlayers: Boolean,
    teamId: Number,
});

const $q = useQuasar();

const emit = defineEmits(["loaded", "update"]);

const editing = ref(props.create)
</script>
