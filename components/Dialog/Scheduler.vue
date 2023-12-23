<template>
    <q-dialog v-model="isOpen" persistent @hide="emit('close')" >
        <q-card class="scheduler--wrap">
            <q-card-section class="q-pb-xs">
                <h1 class="text-md text-bold">Schedule Event</h1>
            </q-card-section>


            <q-card-section class="inputs">
                   <q-input v-model="name" label="Title" outlined dense />
                <q-input
                    readonly
                    :model-value="start_time"
                    outlined
                    dense
                    label="Start time"
                >
                    <InputDate v-model="start_time" :limit="false"> </InputDate>
                </q-input>
                <q-input
                    readonly
                    :model-value="end_time"
                    outlined
                    dense
                    label="End time"
                >
                    <InputDate v-model="end_time" :limit="false"> </InputDate>
                </q-input>
                     <q-select
                    :options="colorOptions"
                    v-model="color"
                    dense
                    outlined
                    label="Event color"
                    behavior="menu"
                    emit-value
                    required
                >
                    <template v-slot:prepend>
                        <q-icon name="circle" :style="{ color }" />
                    </template>
                    <template v-slot:selected>
                        {{
                            colorOptions.find(({ value }) => value === color)
                                ?.label
                        }}
                    </template>
                    <template v-slot:option="{ opt, itemProps }">
                        <q-item clickable v-ripple v-bind="itemProps">
                            <q-item-section avatar>
                                <q-icon
                                    name="circle"
                                    :style="{ color: opt.value }"
                                />
                            </q-item-section>
                            <q-item-section>
                                {{ opt.label }}
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>
                  <q-input
                    outlined
                    dense
                    readonly
                    @click="toggleRinkSearch"
                    :model-value="rink?.name"
                    label="Location"
                />
            </q-card-section>


            <q-card-section style="padding-top: 0">
                <h3
                    class="text-sm text-bold"
                    v-if="invitedPlayers?.length || invitedTeams?.length"
                >
                    Will send invitations to:
                </h3>
                <q-list separator>
                    <q-item
                        v-for="player in invitedPlayers"
                        :key="player.id"
                        class="row no-wrap items-center"
                    >
                        <q-item-section avatar>
                            <div style="width: 1em" class="q-mr-sm">
                                <Avataaar v-bind="JSON.parse(player.avatar)" />
                            </div>
                        </q-item-section>
                        <q-item-section>
                            {{ player.first_name }} {{ player.last_name }}
                        </q-item-section>
                    </q-item>
                    <q-item
                        v-for="team in invitedTeams"
                        :key="team.id"
                        class="row items-center"
                    >
                        <q-item-section avatar>
                            <div style="width: 1em" class="q-mr-sm">
                                <TeamAvatar :teamId="team.id" />
                            </div>
                        </q-item-section>
                        <q-item-section>
                            {{ team.name }}
                        </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="toggleSearch">
                        <q-item-section avatar>
                            <q-icon
                                size="1em"
                                name="add"
                                flat
                                round
                                class="q-mr-sm"
                            />
                        </q-item-section>
                        <q-item-section> Add others to event </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
            <slot name="buttons">
                <q-card-actions align="right" class="row justify-between">
                    <q-btn
                        flat
                        label="Back"
                        @click="emit('close')"
                        v-close-popup
                    ></q-btn>
                    <q-btn
                        flat
                        label="Save"
                        color="primary"
                        @click="save"
                    ></q-btn>
                </q-card-actions>
            </slot>
        </q-card>
    </q-dialog>
</template>
<style lang="scss" scoped>
.scheduler--wrap {
    width: 500px;
}
    .inputs {
        .q-field {
            margin-bottom: var(--space-sm);
        }
    }
</style>
<script setup lang="ts">
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";
import { useQueryClient } from "@tanstack/vue-query";
const queryClient = useQueryClient();
const props = defineProps({
    modelValue: Boolean,
    date: [Object, String],
    editedItem: Object,
});

const emit = defineEmits(["close", "save", "update:modelValue"]);

const isOpen = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const start_time = ref(null);
const end_time = ref(null);
const { toTimezone } = useTime();
const dayjs = useDayjs();
watch(isOpen, (val) => {
    if (val) start_time.value = dayjs(props.date).format("YYYY-MM-DD HH:mm");
    if (!val) {
        name.value = null;
        color.value = "#3f51b5";
        start_time.value = null;
        end_time.value = null;
        invitedPlayers.value = [];
        invitedTeams.value = [];
        rink.value = null;
    }
});

const name = ref(null);
const color = ref("#3f51b5");

const save = async () => {
    const { user: userId } = useUser();
    const client = useSupabaseClient();
    const { error, data } = await client
        .from("schedule")
        .insert({
            name: name.value,
            start_time: start_time.value
                ? dayjs(start_time.value)?.toISOString()
                : null,
            end_time: end_time.value
                ? dayjs(end_time.value)?.toISOString()
                : null,
            color: color.value,
            rink_id: rink?.value?.id
        })
        .select("id")
        .single();
    const { id: schedule_id } = data;

    const { error: errorJunction } = await client
        .from("schedule_members")
        .insert([
            {
                profile_id: userId.value,
                schedule_id,
            },
            ...invitedPlayers.value.map((player) => ({
                profile_id: player.profile_id,
                schedule_id,
            })),
            ...invitedTeams.value.map((team) => ({
                team_id: team.id,
                schedule_id,
            })),
        ]);
    isOpen.value = false;
    queryClient.invalidateQueries({
        queryKey: ["calendar", "events"],
    });
};

const invitedTeams = ref([]);
const invitedPlayers = ref([]);

const toggleSearch = () => {
    const { toggleGlobalSearch } = useDialogStore();
    const { user: userId } = useUser();
    useDialogStore().toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ["team", "profile"],
            callback: (val) => {
                if (val.resourcetype === "profile") {
                    invitedPlayers.value.push(val);
                }
                if (val.resourcetype === "team") {
                    invitedTeams.value.push(val);
                }
            },
            filterIds: [
                userId.value,
                ...invitedPlayers.value.map(({ profile_id }) => profile_id),
                ...invitedTeams.value.map(({ id }) => id),
            ],
        },
    });
};

const rink = ref(null);

const toggleRinkSearch = () => {
    const { toggleGlobalSearch } = useDialogStore();
    useDialogStore().toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ["rink"],
            callback: (val) => {
                rink.value = val;
            },
        },
    });
};

const colorOptions = ref([
    { label: "Red", value: "#f44336" },
    { label: "Pink", value: "#e91e63" },
    { label: "Purple", value: "#9c27b0" },
    { label: "Blue", value: "#3f51b5" },
    { label: "Light blue", value: "#2196f3" },
    { label: "Teal", value: "#009688" },
    { label: "Green", value: "#1b5e20" },
    { label: "Amber", value: "#ffa000" },
    { label: "Orange", value: "#e65100" },
    { label: "Brown", value: "#795548" },
]);
</script>
