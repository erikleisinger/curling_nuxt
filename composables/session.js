import { useAuthStore } from "@/store/auth";

export const useSession = () => {
    const logout = async () => {
        const client = useSupabaseAuthClient();
        await client.auth.signOut();
        navigateTo('/login')
    };
    return { logout };
};
