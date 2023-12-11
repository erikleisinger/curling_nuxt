import { useAuthStore } from "@/store/auth";

export const useSession = () => {
    const logout = async () => {
        const client = useSupabaseClient();
        await client.auth.signOut();
        navigateTo('/login')
    };
    return { logout };
};
