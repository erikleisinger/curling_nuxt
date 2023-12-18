export default defineNuxtRouteMiddleware(async (to, from) => {
    const {setLoading} = useLoading();
    if (!to.hash && !from.hash) setLoading(true)
    const {value: user} = useSupabaseUser()
    if (!user && to.fullPath !== '/login') {
        return navigateTo('/login')
    }
    if (user && to.fullPath === '/login') {
        return navigateTo('/gateway')
    }
})