import { useSessionStore } from '@/store/session'
export default defineNuxtRouteMiddleware((to, from) => {
    if (to.fullPath === '/login') return;
    const store = useSessionStore();
    const {game} = store;
    if (!game?.id) return navigateTo('/select')
})