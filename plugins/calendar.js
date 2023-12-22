import FullCalendar from '@fullcalendar/vue3'
export default defineNuxtPlugin((app) => {
    app.vueApp.component("FullCalendar", FullCalendar)
});