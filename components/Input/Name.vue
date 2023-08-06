<template>
    <q-item-label class="row items-center no-wrap"  >
         <div class="col-shrink"  v-if="!editingName" style="position: relative; max-width: calc(100% - 96px)" >
            <q-btn
                size="xs"
                flat
                round
                icon="edit"
                color="grey-8"
                @click="editingName = true"
                :disable="disabled || savingName"
                v-if="!editingName && !disabled"
                class="floating__edit"
            />
        <slot name="text">
           
                {{ name || "Unnamed team" }}
           
        </slot>
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
<style lang="scss" >
    .floating__edit {
        position: absolute;
        top: 0;
        right: -3em;
        z-index: 1;
    }
</style>
<script setup>
    const emit = defineEmits(['save'])

    const props = defineProps({
        disabled: Boolean,
        name: String,
    })
    const editedName = ref(null);
    const editingName = ref(false);
    const savingName = ref(false)



    const saveName = () => {
        savingName.value = true;
        editingName.value = false;
        emit('save', editedName.value);
        setTimeout(() => {
            savingName.value = false;
        }, 1000)
    }
</script>