export default defineNuxtRouteMiddleware(async (to, from) => {
    const {setPageLoading} = useLoading();
    setPageLoading(true)
    const {value: user} = useSupabaseUser()
    if (!user && to.fullPath !== '/login') {
        return navigateTo('/login')
    }
    if (user && to.fullPath === '/login') {
        return navigateTo('/gateway')
    }
})