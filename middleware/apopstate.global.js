export default defineNuxtRouteMiddleware(async () => {
    if (window.noPopState) {
        window.noPopState = false;
        return abortNavigation()
    }
})