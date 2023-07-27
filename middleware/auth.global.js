// // import  {useAuthStore} from '@/store/auth'
// export default defineNuxtRouteMiddleware((to, from) => {
//     // const user = useSupabaseUser()
//     // const store = useAuthStore();
//     // console.log('user: ', user)
//     // store.setLoggedIn(!!user.value?.id)
//     // if (!user.value && to.fullPath !== '/login') return navigateTo('/login');
//     // if (to.fullPath === '/login' && !!user.value) return navigateTo('/');
// })
export default defineNuxtRouteMiddleware(async (to, from) => {
    const {value: user} = useSupabaseUser()

    // give time for session to catch up:
    await new Promise((res) => setTimeout(res, 200));
    
    if (!user && to.fullPath !== '/login') {
        return navigateTo('/login')
    }
})