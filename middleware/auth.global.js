export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser();
    console.log(useSupabaseAuthClient())
    if (!user.value && to.fullPath !== '/login') return navigateTo('/login');
    if (to.fullPath === '/login' && !!user.value) return navigateTo('/');
})