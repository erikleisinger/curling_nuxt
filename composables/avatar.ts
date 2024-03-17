export const useAvatar = () => {
    const defaultAvatar = new URL("~/assets/rink.jpg", import.meta.url).href;

    return { defaultAvatar };
};
