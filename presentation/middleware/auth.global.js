import { PUBLIC_ROUTES } from "@/presentation/constants/routes"
export default defineNuxtRouteMiddleware(async (to) => {
   
    const {value: user} = useSupabaseUser()
    if (!user && !PUBLIC_ROUTES.includes(to.path)) {
        return navigateTo('/login')
    }
    if (user && to.fullPath === '/login') {

        return navigateTo('/gateway')
    }
})