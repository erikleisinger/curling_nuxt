import { PUBLIC_ROUTES } from "@/constants/routes"
export default defineNuxtRouteMiddleware(async (to) => {
   
    const {value: user} = useSupabaseUser()
    if (!user && !PUBLIC_ROUTES.includes(to.path)) {
        console.log('auth redir')
        return navigateTo('/login')
    }
    if (user && to.fullPath === '/login') {
        console.log('auth redir to gateway')
        return navigateTo('/gateway')
    }
})