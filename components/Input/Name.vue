<template>
    <q-item-label class="row items-center no-wrap">
        <div class="col-shrink" v-if="!editingName" style="position: relative">
            <div class="row no-wrap">
                <div class="col-shrink truncate-text">
                <slot>
                    {{ name || "Unnamed team" }}
                </slot>
                </div>
                <q-btn
                    size="xs"
                    flat
                    round
                    icon="edit"
                    color="grey-8"
                    @click="editingName = true"
                    :disable="disabled || savingName"
                    v-if="!editingName && !disabled"
                />
            </div>
        </div>
        <q-input
            v-else
            dense
            v-model="editedName"
            @keydown.enter="saveName"
            @blur="() => (editingName = false)"
            autofocus
        >
            <template v-slot:append>
                <q-btn
                    size="xs"
                    flat
                    round
                    icon="check"
                    color="grey-8"
                    @click="saveName"
                    :disable="savingName"
                />
            </template>
        </q-input>
    </q-item-label>
</template>
<script setup>
const emit = defineEmits(["save"]);

const props = defineProps({
    disabled: Boolean,
    name: String,
});
const editedName = ref(null);
const editingName = ref(false);
const savingName = ref(false);

onMounted(() => {
    if (!props.name) return;
    editedName.value = props.name;
});

const saveName = () => {
    savingName.value = true;
    editingName.value = false;
    emit("save", editedName.value);
    setTimeout(() => {
        savingName.value = false;
    }, 1000);
};
</script>
