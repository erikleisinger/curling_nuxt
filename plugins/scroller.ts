import {
    RecycleScroller,
    DynamicScroller,
    DynamicScrollerItem,
} from "vue-virtual-scroller";
export default defineNuxtPlugin((app) => {
    app.vueApp.component("RecycleScroller", RecycleScroller);
    app.vueApp.component("DynamicScroller", DynamicScroller);
    app.vueApp.component("DynamicScrollerItem", DynamicScrollerItem);
});
