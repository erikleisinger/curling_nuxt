export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser();
    if (!user.value && to.fullPath !== '/login') return navigateTo('/login');
    if (to.fullPath === '/login' && !!user.value) return navigateTo('/');
})