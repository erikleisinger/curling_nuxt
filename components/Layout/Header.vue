<template>
 <div class="full-height relative-position ">
     <q-toolbar class="row justify-between items-center header">
       
                <slot name="menu"/>
                <div style="position: absolute; left: 0; right: 0; margin: auto; width: fit-content;">
                    
                <LogoFull :width="$q.screen.xs ? '75px' : '100px'" class="clickable" @click="navigateTo('/')"/>
                
                </div>

                <div class="row items-center">
                 <q-btn icon="notifications" flat round color="white" class="q-mr-sm" @click="toggleNotifications({open: true})" :size="$q.screen.xs ? '14px' : '16px'">
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
        padding-left: var(--space-md);
        padding-right: var(--space-sm);
        background-color: $app-slate;
        &.q-toolbar {
            height: 4em;
            @include sm {
                height: 5em;
            }
        }
       
    }
</style>
<script setup>
    
    import { useDialogStore } from "@/store/dialog";
    const {toggleNotifications} = useDialogStore();

    const {listenForNotifications, count: unreadNotificationCount} = useNotification();

    const {user: userId} = useUser();
    const listener = listenForNotifications();  
</script>