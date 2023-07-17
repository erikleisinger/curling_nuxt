import { useSessionStore } from '@/store/session'
export default defineNuxtRouteMiddleware((to, from) => {
    if (to.fullPath === '/login') return;
    const store = useSessionStore();
    console.log('GAME MIDDLE')
    const {game} = store;
    console.log('GAME: ', game)
    if (!game?.id) return navigateTo('/select')
})