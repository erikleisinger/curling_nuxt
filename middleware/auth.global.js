import  {useAuthStore} from '@/store/auth'
export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()
    console.log(user)
    const store = useAuthStore();
    store.setLoggedIn(!!user.value?.id)
    if (!user.value && to.fullPath !== '/login') return navigateTo('/login');
    if (to.fullPath === '/login' && !!user.value) return navigateTo('/');
})