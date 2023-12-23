<template>
    <div class="calendar-container">
        <header class="row justify-between calendar-header--outer">
            <div class="title">
                <h2 class="text-md text-bold q-pb-xs">
                    {{ isListView ? "Upcoming events" : "Schedule" }}
                </h2>
                <h3 class="text-sm">{{ isListView ? "" : currentRange }}</h3>
            </div>
            <nav class="row justify-between" v-if="!isListView">
                <q-btn
                    dense
                    flat
                    round
                    icon="navigate_before"
                    @click="api.prev()"
                />
                <q-btn
                    dense
                    flat
                    round
                    icon="navigate_next"
                    @click="api.next()"
                />
            </nav>
        </header>
        <FullCalendar
            :options="calendarOptions"
            ref="calendar"
            id="#schedule-calendar"
        >
            <template v-slot:dayHeaderContent="d">
                <div
                    class="calendar-block"
                    v-if="currentView === 'dayGridDay'"
                />
                <h2
                    class="calendar-header--inner"
                    :class="{
                        today: d.isToday,
                        stretch: currentView === 'dayGridDay',
                    }"
                    @click="onHeaderClick(d)"
                >
                    <div class="today--indicator" v-if="d.isToday" />
                    <div
                        class="header--inner__content row justify-center items-center"
                    >
                        {{ getHeaderContent(d) }}
                    </div>
                </h2>
            </template>
            <template v-slot:eventContent="d" v-if="isListView">
                <div
                    class="row items-center full-width full-height justify-between"
                >
                    {{ d.event.title }}
                   
                </div>
            </template>
        </FullCalendar>
        <div
            class="row full-width justify-end q-pa-xs text-sm text-underline q-pr-md"
        >
            <div class="clickable" @click="toggleView">
                {{ isListView ? "Show calendar" : "Show Upcoming" }}
            </div>
        </div>
        <div
            class="selection-menu__container"
            id="selection-menu"
            v-if="showSelectionMenu"
            ref="selectionMenu"
            :style="{ top: `${selectionPosY}px`, left: `${selectionPosX}px` }"
        >
            <q-list>
                <q-item clickable v-ripple @click="schedulerOpen = true">
                    <q-item-section> Schedule event </q-item-section>
                </q-item>
            </q-list>
        </div>
    </div>
    <q-menu :target="eventTarget" :modelValue="eventOpen">
        <q-card class="event-viewmore__container">
            <q-card-section
                :style="{ backgroundColor: eventViewing?.backgroundColor }"
                class="row no-wrap justify-between items-center"
            >
                <h3 class="text-bold text-md text-white">
                    {{ eventViewing?.title }}
                </h3>
                <!-- <q-btn
                    flat
                    round
                    icon="edit"
                    color="white"
                    dense
                    size="sm"
                    @click="editEvent(eventViewing)"
                /> -->
            </q-card-section>
            <q-card-section>
                <div>
                    <h4 class="text-sm text-bold">Start time</h4>
                    {{
                        dayjs(eventViewing.start).format(
                            "MMM DD, YYYY [at] HH:mm a"
                        )
                    }}
                </div>
                <div>
                    <h4 class="text-sm text-bold">End time</h4>
                    {{
                        dayjs(eventViewing.end).format(
                            "MMM DD, YYYY [at] HH:mm a"
                        )
                    }}
                </div>
                <div
                        
                        class="row"
                    >
                        <div
                            style="width: 20px"
                            v-for="teamId in eventViewing.extendedProps.team_id"
                            :key="teamId"
                        >
                     
                            <TeamAvatar :teamId="teamId" />
                        </div>
                         <div
                            style="width: 20px"
                            v-for="profile in eventViewing.extendedProps.profiles"
                            :key="profile.id"
                        >
                     
                            <Avataaar v-bind="JSON.parse(profile.avatar)"/>
                        </div>
                    </div>
                 
            </q-card-section>
        </q-card>
    </q-menu>
    <DialogScheduler v-model="schedulerOpen" :date="selectedDate" :editedItem="itemToEdit" />
</template>
<style lang="scss" scoped>
.calendar-container {
    .calendar-block {
        min-height: 21px;
    }
    .calendar-header--inner {
        font-weight: bold;
        font-size: var(--text-md);
        position: relative;
        min-width: 28px;
        &.stretch {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            padding-top: 2px;
        }
        .today--indicator {
            position: absolute;
            height: 100%;
            aspect-ratio: 1/1;
            background-color: $blue;
            z-index: -1;
            border-radius: 50%;
            left: 0;
            right: 0;
            z-index: 0;
            margin: auto;
        }
        .header--inner__content {
            z-index: 1;
            position: relative;
        }
        &.today {
            color: white;

            padding: 0px 4px;
            &:before {
                content: "";
            }
        }
    }
    :deep(.fc-day-today) {
        background-color: unset !important;
    }
    :deep(.fc-scrollgrid) {
        border-left: unset !important;
    }
    :deep(.fc-theme-standard td) {
        border-right: unset !important;
    }
    :deep(.fc-theme-standard th) {
        border-right: unset !important;
    }
    :deep(.fc-list-day) {
        display: none;
    }
    :deep(.fc-list-day-cushion) {
        padding: unset;
        .calendar-header--inner {
            font-size: var(--text-sm);
        }
    }
    :deep(.fc-list-event-time) {
        font-size: var(--text-sm);
        .list-item-date {
            font-weight: bold;
        }
    }
    :deep(.fc-list-event-graphic) {
        display: none;
    }
    :deep(.color-tab) {
        width: 8px;
        height: 56px;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
    }

    .calendar-header--outer {
        padding: var(--space-xs);
        .title {
            margin-left: 8px;
        }
        h3 {
            margin-top: -4px;
        }
    }
    .selection-menu__container {
        position: fixed;
        background-color: white;
        border-radius: 8px;
        box-shadow: $pretty-shadow;
        z-index: 1;
        .q-list {
            overflow: hidden;
            border-radius: inherit;
        }
    }
}
.event-viewmore__container {
    // padding: var(--space-sm);
    min-width: 200px;
}
</style>
<script setup>
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { onClickOutside } from "@vueuse/core";
import { useUserTeamStore } from "@/store/user-teams";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

const currentDate = ref(null);
const currentView = ref("dayGridWeek");

const isListView = computed(() => currentView.value === "listAllYears");
const setDate = (e) => {
    currentDate.value = e;
};

const selectedDate = ref(null);

const onSelect = (e) => {
    selectedDate.value = e.startStr;
    const { jsEvent } = e;
    let newX = 0;
    let newY = 0;
    if (jsEvent.type === "touchend") {
        const { changedTouches } = jsEvent;
        const [touchEvent] = changedTouches;
        const { pageX, pageY } = touchEvent;
        newX = pageX;
        newY = pageY;
    } else {
        preventClose.value = true;
        const { pageX, pageY } = jsEvent;
        newX = pageX;
        newY = pageY;
    }
    jsEvent.preventDefault();
    triggerSelectionAnimation(newX, newY);
};

const eventTarget = ref(null);
const eventViewing = ref(null);
const eventOpen = ref(false);

const onEventClick = (event) => {
    eventViewing.value = event.event;
    const { el } = event;
    eventTarget.value = el;
    eventOpen.value = true;
};
const { toTimezone } = useTime();

const dayjs = useDayjs();
const getHeaderContent = (data) => {
    return dayjs(data.date).format("DD");
};

const calendar = ref(null);

const api = computed(() => calendar.value?.getApi());

const currentRange = computed(() => {
    const objStart = dayjs(currentDate.value?.start);
    if (api.value?.view?.type === "dayGridDay") {
        return objStart.format("MMMM D");
    } else {
        const month = objStart.format("MMMM");
        const startDate = objStart.format("D");
        const endDate = dayjs(currentDate.value?.end).format("D");
        if (Number(startDate) > Number(endDate)) {
            const objEnd = dayjs(currentDate.value?.end);
            const startMonth = objStart.format("MMM");
            const endMonth = objEnd.format("MMM");
            return `${startMonth} ${startDate} - ${endMonth} ${endDate}`;
        }

        return `${month} ${startDate}-${endDate}`;
    }
});

const selectionPosX = ref(0);
const selectionPosY = ref(0);
const selectionMenu = ref(null);
const showSelectionMenu = ref(false);
const preventClose = ref(false);
onClickOutside(selectionMenu, () => {
    if (preventClose.value) {
        preventClose.value = false;
        return;
    }
    showSelectionMenu.value = false;
});

const triggerSelectionAnimation = (x, y) => {
    const isOpen = showSelectionMenu.value;
    showSelectionMenu.value = true;
    if (!isOpen) {
        selectionPosX.value = x;
        selectionPosY.value = y;
        nextTick(() => {
            gsap.from(selectionMenu.value, {
                scale: 0,
                transformOrigin: "top left",
                duration: 0.2,
                ease: "power",
            });
        });
    } else {
        const state = Flip.getState(selectionMenu.value);
        selectionPosX.value = x;
        selectionPosY.value = y;
        nextTick(() => {
            Flip.from(state, {
                duration: 0.1,
                ease: "power",
                absolute: "#selection-menu",
            });
        });
    }
};

const onHeaderClick = ({ date }) => {
    const { view } = api.value;
    const td = calendar.value.$el.querySelectorAll("td");
    const th = calendar.value.$el.querySelectorAll("th");
    const state = Flip.getState([td, th]);
    if (view.type === "dayGridDay") {
        api.value.changeView("dayGridWeek");
        currentView.value = "dayGridWeek";
    } else {
        api.value.gotoDate(date);
        api.value.changeView("dayGridDay");
        currentView.value = "dayGridDay";
    }
    Flip.from(state, {
        nested: true,
        duration: 0.2,
        fade: true,
    });
};

// SCHEDULE/EDIT EVENTS
const schedulerOpen = ref(false);

// FETCH EVENTS

const getEvents = async () => {
    const { user: userId } = useUser();
    const userTeams = useUserTeamStore()
        .userTeams.map(({ id }) => id)
        .join(",");
    const client = useSupabaseClient();
    const { data } = await client
        .from("schedule_members")
        .select(
            `
            id,
            created_at,
            profile:profile_id (
                id,
                first_name,
                last_name,
                avatar
            ),
            team:team_id (
                id,
                name,
                avatar_url
            ),
            schedule:schedule_id (
                id,
                name,
                start_time,
                end_time,
                group_id,
                color,
                rink_id,
                event_id
            )
        `
        )
        .or(`profile_id.eq.${userId.value},team_id.in.(${userTeams})`);

    return data;
};

const { isLoading, data: events } = useQuery({
    queryKey: ["calendar", "events"],
    queryFn: getEvents,
    refetchOnWindowFocus: false,
    select: (val) => {
        const events = val.reduce((all, item) => {
            const { schedule: event } = item;
            console.log(item, all);

            const formatted = {
                id: event.id,
                start: event.start_time,
                end: event.end_time,
                backgroundColor: event.color,
                borderColor: event.color,
                title: event.name,
                extendedProps: {
                    team_id: item.team?.id ? [item.team.id] : [],
                    profiles: item.profile ? [item.profile] : [],
                },
            };
            const duplicateIndex = all.findIndex(({ id }) => id === event.id);
            if (duplicateIndex !== -1) {
                const newAll = [...all];
                newAll.splice(duplicateIndex, 1);
                return [
                    ...newAll,
                    {
                        ...formatted,
                        extendedProps: {
                            team_id: [
                                ...all[duplicateIndex].extendedProps.team_id,
                                ...formatted.extendedProps.team_id,
                            ],
                            profiles: [
                                ...all[duplicateIndex].extendedProps.profiles,
                                ...formatted.extendedProps.profiles,
                            ],
                        },
                    },
                ];
            }

            return [...all, formatted];
        }, []);
        setTimeout(() => {
            events.forEach((event) => {
                api.value.addEvent(event);
            });
        }, 100);

        return val;
    },
});

const onEventMount = (e) => {
    nextTick(() => {
        if (!isListView.value) return;
        const { el } = e;

        const { event } = e;
        const colorTab = document.createElement("div");
        colorTab.setAttribute("class", "color-tab");
        colorTab.setAttribute(
            "style",
            `background-color: ${event.backgroundColor}`
        );
        el.prepend(colorTab);
        const { start, end } = event;
        const headerText = dayjs(start).format("MMM DD, YYYY");
        const timeDiv = el.querySelector(".fc-list-event-time");

        timeDiv.innerText = `${dayjs(start).format("h:mm a")}`;
        const header = document.createElement("div");
        header.setAttribute("class", "list-item-date");
        header.innerText = headerText;
        timeDiv.prepend(header);
    });
};

const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin, listPlugin],
    initialView: "dayGridWeek",
    headerToolbar: false,
    height: 150,
    datesSet: setDate,
    select: onSelect,
    selectable: true,
    selectLongPressDelay: 10,
    events: [],
    eventClick: onEventClick,
    eventDidMount: onEventMount,
    views: {
        listAllYears: {
            type: "listYear",
            duration: { years: 999 },
        },
    },
});

const toggleView = () => {
    if (currentView.value === "listAllYears") {
        api.value.changeView("dayGridWeek");
        currentView.value = "dayGridWeek";
    } else {
        api.value.changeView("listAllYears");
        currentView.value = "listAllYears";
    }
};

const queryClient = useQueryClient();

const deleteEvent = async () => {
    eventOpen.value = false;
    const client = useSupabaseClient();
    console.log(eventViewing.value.extendedProps.id);
    await client
        .from("schedule_members")
        .delete()
        .eq("id", eventViewing.value.extendedProps.id);

    const calendarEvent = api.value.getEventById(eventViewing.value.id);
    calendarEvent.remove();
    eventViewing.value = null;
    eventTarget.value = null;

    setTimeout(() => {
        queryClient.invalidateQueries({
            queryKey: ["calendar", "events"],
        });
    }, 50);
};

const itemToEdit = ref(null)

const editEvent = (e) => {
    console.log('edit: ', e)
    // itemToEdit.value = {
    //     ...
    // }

}
</script>
