import { useAuthStore } from "@/store/auth";

export const useSession = () => {
    const authStore = useAuthStore();
    const logout = async () => {
        const client = useSupabaseAuthClient();
        await client.auth.signOut();
        authStore.setLoggedIn(false);
    };
    return { logout };
};
