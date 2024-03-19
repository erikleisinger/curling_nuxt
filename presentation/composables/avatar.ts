export const useAvatar = () => {
    const defaultAvatar = new URL("~/presentation/assets/rink.jpg", import.meta.url).href;

    return { defaultAvatar };
};
