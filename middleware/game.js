import { useGameStore } from '@/store/game'
export default defineNuxtRouteMiddleware((to, from) => {
    if (to.fullPath === '/login') return;
    const store = useGameStore();
    const {game} = store;
    console.log('NAV GUARD: ', !game?.id)
    if (!game?.id) return navigateTo('/select')
    
})