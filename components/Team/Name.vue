<template>
    <div style="position: relative">
        <h2 class="text-sm text-bold text-center" v-if="!editing">
            {{ name }}
        </h2>
        <q-input
            dense
            rounded
            outlined
            label="Update team name"
            v-model="editedName"
            autofocus
            :maxlength="MAX_TEAM_NAME_LENGTH"
            @keydown.enter="saveName"
            v-else
        >
            <template v-slot:before>
                <q-btn
                    flat
                    round
                    icon="close"
                    color="grey-8"
                    padding="2px"
                    @click="toggleEdit(false)"
                    :disable="saving"
                />
            </template>
            <template v-slot:after>
                <q-btn
                    flat
                    round
                    icon="check"
                    color="green"
                    padding="2px"
                    @click="saveName"
                    :loading="saving"
                />
            </template>
        </q-input>
        <div class="edit--floating" v-if="canEdit && !editing">
            <q-btn
                flat
                round
                icon="edit"
                color="grey-8"
                size="sm"
                padding="2px"
                @click="toggleEdit(true)"
            />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.edit--floating {
    position: absolute;
    top: 0;
    right: -1.5em;
}
</style>
<script setup>
import {MAX_TEAM_NAME_LENGTH} from '@/constants/validation'
import Team from "@/store/models/team";
const props = defineProps({
    canEdit: Boolean,
    teamId: Number,
});

const name = computed(() => useRepo(Team).where('id', props.teamId).first()?.name || 'Unnamed team')

const editing = ref(false);

const editedName = ref(null);
const toggleEdit = (open) => {
    if (open) {
        editedName.value = name.value;
    } else {
        editedName.value = null;
    }

    editing.value = open;
};

const saving = ref(false);

const saveName = async () => {
    saving.value = true;
    const { errors } = await useSupabaseClient()
        .from("teams")
        .update({
            name: editedName.value,
        })
        .eq("id", props.teamId);
    if (errors) {
        saving.value = false;
        return;
    }
    useRepo(Team).where("id", props.teamId).update({
        name: editedName.value,
    });
    saving.value = false;
    editing.value = false;
};
</script>
<script>
    export default {
        name: 'TeamName'
    }
</script>