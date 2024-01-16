<template>
    <div class="profile-field">
        <div>
            <h5>{{ title }}</h5>
            <div v-if="!editing || value === 'rink_id'">
                <slot name="display" :value="editedValue">
                    {{ editedValue }}
                </slot>
            </div>
            <div v-else-if="value !== 'rink_id'">
                <slot name="selection" :editedValue="editedValue">
                    <q-input dense v-model="editedValue">
                        {{ editedValue }}
                    </q-input>
                </slot>
            </div>
        </div>
        <div>
            <Button
                round
                icon="edit"
                color="white"
                text-color="mint"
                size="12px"
                @click="onStartEdit"
                :loading="saving"
                :disabled="saving"
                v-show="!editing"
                :id="buttonId"
            />
            <Button
                round
                icon="check"
                color="mint"
                size="12px"
                @click="onEndEdit"
                v-show="!!editing"
            />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.profile-field {
    display: flex;
    justify-content: space-between;

    margin-top: var(--space-sm);
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

const props = defineProps({
    buttonId: String,
    modelValue: [String, Object],
    playerId: String,
    title: String,
    value: String,
});

const emit = defineEmits(["save", "update:modelValue"]);

const editing = ref(false);

const editedValue = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});
const saving = ref(false);
const onEndEdit = async () => {
    saving.value = true;
    editing.value = false;

    const client = useSupabaseClient();

    let updates;
    if (props.value === "rink_id") {
        updates = { [props.value]: editedValue.value?.id };
    } else {
        updates = { [props.value]: editedValue.value };
    }
    await client.from("profiles").update(updates).eq("id", props.playerId);
    queryClient.invalidateQueries({
        queryKey: ["player", props.playerId],
    });
    saving.value = false;
};

const onStartEdit = () => {
    editing.value = true;
    if (props.value !== "rink_id") return;
    useDialogStore().toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ["rink"],
            inputLabel: "Search for a home rink",
            callback: (val) => {
                editedValue.value = val;
               
            },
        },
    });
};

const isSearchOpen = computed(() => useDialogStore().globalSearch.open);

watch(isSearchOpen, (val) => {
    if (val) return;
    if (!editing.value) return;
     nextTick(() => {
                    onEndEdit();
                });
})
</script>
