import { BannerColors } from "@/types/color";
import type { Database } from "@/types/supabase";
import { SUPABASE_AUTH_STORAGE_KEY } from "@/constants/supabase";
import { PUBLIC_ROUTES } from "@/constants/routes";
export const useSupabaseFetch = () => {
    const client = useSupabaseClient<Database>();

    function parseJwt(token) {
        var base64Url = token.split(".")[1];
        var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        var jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map(function (c) {
                    return (
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join("")
        );
        return JSON.parse(jsonPayload);
    }

    /**
     *
     * @param error {string} The error thrown by a supabase client call
     * @returns {boolean} true = rerun query;
     */
    const handleError = async (code) => {
        if (code === "PGRST301") {
            const route = useRoute();
            reloadNuxtApp({
                path: route.fullPath
            });
        }
    };

    const checkHeaders = async () => {
        const headers = localStorage.getItem(SUPABASE_AUTH_STORAGE_KEY);
        if (!headers) return;
        const route = useRoute();
        if (PUBLIC_ROUTES.includes(route.fullPath)) return;
        const { email } = JSON.parse(headers)?.user;
        const { headers: outgoingHeaders } = client.auth;
        const { Authorization } = outgoingHeaders;
        const token = Authorization.split(" ")[1];
        if (email !== parseJwt(token).email) {
            reloadNuxtApp({
                path: route.fullPath
            });
        }
    };

    const fetchHandler = async (
        promise: Function,
        callbacks?: { onError?: string | Function; onSuccess?: string }
    ) => {
        await checkHeaders();
        const { data, error } = await promise();
        if (error) {
            const { code } = error;
            await handleError(code);
            if (callbacks?.onError) {
                const { setBanner } = useBanner();
                const errorMsg =
                    typeof callbacks.onError === "function"
                        ? callbacks.onError(error)
                        : callbacks.onError;
                setBanner(`${errorMsg} (code ${code})`, BannerColors.Negative);
            }
        } else if (data) {
            if (callbacks?.onSuccess) {
                const { setBanner } = useBanner();
                setBanner(callbacks.onSuccess, BannerColors.Primary);
            }
        }
        return { data: data || true, error };
    };
    return { client, fetchHandler };
};
