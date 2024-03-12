export default defineNuxtRouteMiddleware(async (to) => {
    const publicroutes = ['/login', '/update-password', '/demo']
    const {value: user} = useSupabaseUser()
    if (!user && !publicroutes.includes(to.path)) {
        console.log('auth redir')
        return navigateTo('/login')
    }
    if (user && to.fullPath === '/login') {
        console.log('auth redir to gateway')
        return navigateTo('/gateway')
    }
})