export default defineNuxtRouteMiddleware(async (to, from) => {
    const {value: user} = useSupabaseUser()

    // give time for session to catch up:
    await new Promise((res) => setTimeout(res, 200));
    
    if (!user && to.fullPath !== '/login') {
        return navigateTo('/login')
    }
})