<template>
    <!-- REQUESTEE / INCOMING -->
        <q-expansion-item
        switch-toggle-side
        expand-separator
        icon="perm_identity"
        label="Account settings"
        default-opened
      >
         <template v-slot:header>
    <div style="height: 3em; position: sticky; top: 0" class="q-px-md row items-center">
        <h2 class="text-md text-bold">Incoming requests ({{requestsIncoming.length}})</h2>
    </div>
         </template>
<q-list separator bordered>
        <q-item v-for="request in requestsIncoming"
        :key="request.id"
        class="row items-center justify-between no-wrap">
            <q-item-section avatar>
                 <q-fab
                        :color="STATUS_COLORS[request.status]"
                        :icon="ICONS[request.status]"
                        direction="right"
                        dense
                        padding="4px"
                        class="accept-reject__button"
                        :persistent="false"
                       v-if="request.status === 'pending'"
                   
                    >
                        <q-fab-action
                            color="positive"
                            text-color="white"
                            icon="check_circle"
                            label="Accept"
                             
                            @click="
                                updateTeamRequestStatus({
                                    team_id: request.team_id,
                                    requester_profile_id: request.requester_id,
                                    status: 'accepted',
                                })
                            "
                        ></q-fab-action>
                        <q-fab-action
                            color="white"
                            text-color="red"
                            icon="do_disturb"
                            label="Reject"
                          
                            @click="
                                updateTeamRequestStatus({
                                    team_id: request.team_id,
                                    requester_profile_id: request.requester_id,
                                    status: 'rejected',
                                })
                            "
                        ></q-fab-action>
                    </q-fab>
                    <q-btn fab :color="STATUS_COLORS[request.status]" :icon="ICONS[request.status]" padding="4px" aria-readonly="true" v-else/>
                   
            </q-item-section>
            <q-item-section>
                <!-- <q-item-label overline>
                    <span :class="`text-${STATUS_COLORS[request.status]}`" class="overline">  {{ request.status }}</span>
                    
                </q-item-label> -->
                <q-item-label
                    >
                    <ProfileChip :username="request.requester_username" :id="request.requester_id"/>
                    <!-- <span class="text-bold"
                        >@{{ request.requester_username }}</span
                    > -->
                    has invited you to join <TeamChip :name="request.team_name" :id="request.team_id"/></q-item-label
                >
                <q-item-label caption>{{request.status}} {{
                    parseTimestamp(request.updated_at)
                }}</q-item-label>
            </q-item-section>
           <q-item-section side top class="column">
                <div class="col-grow row items-center" v-if="request.status !== 'pending'">
                      <q-btn
                        icon="clear"
                        flat
                       
                        @click="
                            clearRequest(request.id)
                        "
                        >Clear</q-btn
                    > 
                </div>
            </q-item-section>
                   
        </q-item>
</q-list>
        </q-expansion-item>

    <!-- REQUESTER / OUTGOING -->
    <q-expansion-item
        switch-toggle-side
        expand-separator
        icon="perm_identity"
        label="Account settings"
      >
      <template v-slot:header>
    <div style="height: 3em" class="q-px-md row items-center">
        <h2 class="text-md text-bold">Sent requests ({{requestsOutgoing.length}})</h2>
    </div>
      </template>
    
    <q-list separator bordered>
 
        <q-item  v-for="request in [...requests].filter((r) => r.role === 'requester')"
        :key="request.id"
        class="row items-center justify-between no-wrap">
           <q-item-section avatar>
                  <q-icon name="east" v-if="request.status === 'pending'"/>
                     <q-icon  v-else :name="ICONS[request.status]" :color="STATUS_COLORS[request.status]"/>
            </q-item-section> 
            <q-item-section>
                <!-- <q-item-label overline>
                    <q-chip
                        rounded
                        :color="STATUS_COLORS[request.status]"
                        text-color="white"
                        class="request-status__container text-sm"
                       
                    >
                        {{ request.status }}
                    </q-chip>
                </q-item-label> -->
                <q-item-label
                    >Request to  <ProfileChip :username="request.requestee_username" :id="request.requestee_id"/>
                    for access to <TeamChip :name="request.team_name" :id="request.team_id"/></q-item-label
                >
                <q-item-label caption>{{request.status}} {{
                    parseTimestamp(request.updated_at)
                }}</q-item-label>
            </q-item-section>

            <q-item-section side top class="column">
                <div class="col-grow row items-center">
                    <q-btn
                        icon="clear"
                        flat
                        @click="
                            cancelRequest({
                                team_id: request.team_id,
                                requestee_profile_id: request.requestee_id,
                            })
                        "
                        >{{
                            request.status === "pending" ? "Cancel" : "Clear"
                        }}</q-btn
                    >
                </div>
            </q-item-section>
        </q-item>

    </q-list>
    </q-expansion-item>
</template>
<style lang="scss">
.accept-reject__button {
    .q-fab__actions {
        flex-direction: column !important;
    }
    .q-fab__label {
        padding-top: 0.1em;
    }
}
</style>
<script setup lang="ts">
import { BasicTeamRequest, RequestRole } from "@/types/request";
import { useTeamRequestStore } from "@/store/team-requests";
import { useThrottleFn } from "@vueuse/core";
import { parseAvatar } from "@/utils/avatar";

const requests = ref<BasicTeamRequest[]>([]);

const requestsIncoming = computed(() => requests.value.filter((r) => r.role === 'requestee'))

const requestsOutgoing = computed(() => requests.value.filter((r) => r.role === 'requester'))

const parseTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    const dayjs = useDayjs();
    return dayjs(timestamp).fromNow();
};

const parseRequest = (request: BasicTeamRequest) => {
    if (request.role === "requester") {
        return `Requesting team "${request.team_name}" from @${request.requestee_username}`;
    } else {
        return "";
    }
};

const ICONS = {
    accepted: "check",
    pending: "question_mark",
    rejected: "close",
};

const STATUS_COLORS = {
    accepted: "positive",
    pending: "warning",
    rejected: "negative",
};

const handleInsert = async (id: number) => {
    const { client } = useSupabaseFetch();
    const { data } = await client
        .rpc("get_team_requests")
        .eq("id", id)
        .returns<BasicTeamRequest[]>();
    const [insertedRequest] = data || [];
    requests.value.splice(0, 0, insertedRequest);
};

const handleStatusUpdate = async (request: BasicTeamRequest) => {
    const { id, updated_at, status } = request;
    const oldRequest = requests.value.find((req) => req.id === id);
    if (!oldRequest) return;
    const index = requests.value.findIndex((req) => req.id === id);

    if (index === -1) return;
    requests.value.splice(index, 1, { ...oldRequest, updated_at, status });
};

const handleDelete = useThrottleFn(async (deletedId: number) => {
    clearRequest(deletedId);
}, 10);

const clearRequest = (deletedId: number) => {
    const index = requests.value.findIndex(
        (req: BasicTeamRequest) => req.id === deletedId
    );
    if (index === -1) return;
    requests.value.splice(index, 1);
};

const EVENT_TYPES = {
    DELETE: "DELETE",
    INSERT: "INSERT",
    UPDATE: "UPDATE",
};

const handleSubscription = (event: any, role: RequestRole) => {
    const { eventType, old: deleted } = event;
    if (eventType === EVENT_TYPES.DELETE) {
        const { old: deletedRequest } = event;
        handleDelete(deletedRequest.id);
    }
    if (eventType === EVENT_TYPES.INSERT) {
        const { new: newRequest } = event;
        if (!newRequest?.id) return;

        handleInsert(newRequest.id);
    }
    if (eventType === EVENT_TYPES.UPDATE) {
        const { new: updatedRequest } = event;
        handleStatusUpdate(updatedRequest);
    }
};

onMounted(async () => {
    const { user } = useUser();
    const userId = user.value;
    const { client } = useSupabaseFetch();
    const { data } = await client
        .rpc("get_team_requests")
        .returns<BasicTeamRequest[]>();
    if (!data) return;
    requests.value = data;

    const changeSubscriber = client
        .channel("table-db-changes")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "team_requests",
                filter: `requester_profile_id=eq.${userId}`,
            },
            (payload) => handleSubscription(payload, "requester")
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "team_requests",
                filter: `requestee_profile_id=eq.${userId}`,
            },
            (payload) => handleSubscription(payload, "requestee")
        )
        // .on(
        //     "postgres_changes",
        //     {
        //         event: "UPDATE",
        //         schema: "public",
        //         table: "team_requests",
        //         filter: `requester_profile_id=eq.${userId}`,
        //     },
        //     (payload) => handleUpdate(payload.new, "requester")
        // )
        // .on(
        //     "postgres_changes",
        //     {
        //         event: "UPDATE",
        //         schema: "public",
        //         table: "team_requests",
        //         filter: `requestee_profile_id=eq.${userId}`,
        //     },
        //     (payload) => handleUpdate(payload.new, "requestee")
        // )
        //   .on(
        //     "postgres_changes",
        //     {
        //         event: "DELETE",
        //         schema: "public",
        //         table: "team_requests",
        //         filter: `requestee_profile_id=eq.${userId}`,
        //     },
        //     (payload) => handleDelete(payload.new)
        // )
        //  .on(
        //     "postgres_changes",
        //     {
        //         event: "DELETE",
        //         schema: "public",
        //         table: "team_requests",
        //         filter: `requester_profile_id=eq.${userId}`,
        //     },
        //     (payload) => handleDelete(payload.new)
        // )
        .subscribe();
});

const teamRequestStore = useTeamRequestStore();

const { updateTeamRequestStatus } = teamRequestStore;

const cancelRequest = async ({
    team_id,
    requestee_profile_id,
}: {
    team_id: number;
    requestee_profile_id: string;
}) => {
    await teamRequestStore.cancelTeamRequest({ team_id, requestee_profile_id });

    // emit("update", {
    //     teamId: team_id,
    //     updates: {
    //         status: null,
    //         subject: null,
    //     },
    // });
};
</script>
