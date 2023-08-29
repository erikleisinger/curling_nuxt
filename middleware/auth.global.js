export default defineNuxtRouteMiddleware(async (to, from) => {
    console.log('to:', to)
    console.log('from: ', from)
    const {value: user} = useSupabaseUser()
    if (!user && to.fullPath !== '/login') {
        console.log('go login')
        return navigateTo('/login')
    }
    if (user && to.fullPath === '/login') {
        console.log('go gateway')
        return navigateTo('/gateway')
    }
})