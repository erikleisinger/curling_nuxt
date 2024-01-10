<template>
 <div class="full-height relative-position ">
     <q-toolbar class="row justify-between items-center header">
       
                <slot name="menu"/>
                <div style="position: absolute; left: 0; right: 0; margin: auto; width: fit-content;" class="row items-center"> 
                    
                <LogoFull :width="$q.screen.xs ? '75px' : '75px'" class="clickable" @click="navigateTo('/')"/>
                
                </div>

                <div class="row items-center">
                 <q-btn icon="notifications" flat round color="white"  @click="toggleNotifications({open: !notificationsOpen})" :size="$q.screen.xs ? '14px' : '16px'">
                     <transition appear enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
                    <q-badge
                        color="red"
                        floating
                        rounded
                        v-if="!!unreadNotificationCount"
                        >
                        {{unreadNotificationCount}}
                        </q-badge>
                </transition>
                 </q-btn>
                 <div class="relative-position" :style="{width: $q.screen.xs ? '30px' : '35px', height: $q.screen.xs ? '30px' : '35px'}">
                 <RingsMenu :size="$q.screen.xs ? '30px' : '35px'" class="clickable rings-button"/>
                 </div>
                </div>
                           </q-toolbar>
        </div>
 
</template>
<style lang="scss" scoped>
    .header {
        padding: 0px var(--space-xxs);
        padding-right: var(--space-sm);
        @include sm {
            padding-left: var(--space-md);
        }
        
        // padding-right: var(--space-sm);
        // @include bg-blue-side;
        background-color: $app-royal-blue;
        &.q-toolbar {
            height: $app-header-height-xs;
            @include sm {
                height: $app-header-height-sm;
            }
           
        }
       
    }
</style>
<script setup>
    
    import { useDialogStore } from "@/store/dialog";
    const {toggleNotifications} = useDialogStore();
    const notificationsOpen = computed(() => useDialogStore().notifications.open)

    const {listenForNotifications, count: unreadNotificationCount} = useNotification();

    const {user: userId} = useUser();
    const listener = listenForNotifications();  
</script>