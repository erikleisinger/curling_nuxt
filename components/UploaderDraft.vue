<script setup>
const uploading = ref(false);
const src = ref("");
const files = ref();
const path = ref("");
const fileUpload = ref(null);

const compressFile = async (file) => {
    const options = {
        maxSizeMB: 0.029,
        maxWidthOrHeight: 300,
        useWebWorker: true,
    };
    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.log(error);
    }
};

const uploadAvatar = async (evt) => {
    if (!user.value.id) return;
    const { clearBanner } = useBanner();
    clearBanner();
    files.value = evt.target.files;
    uploading.value = true;
    if (!files.value || files.value.length === 0) {
        const { setBanner } = useBanner();
        setBanner("You must select an image to upload.", BannerColors.Negative);
    }

    let file = files.value[0];
    file = await compressFile(file);
    if (file.size > MAX_AVATAR_FILE_SIZE) {
        const { setBanner } = useBanner();
        setBanner("Image is too large.", BannerColors.Negative);
        uploading.value = false;
        fileUpload.value.value = "";
        return;
    }
    const fileExt = file.name.split(".").pop();
    path.value = `${Math.random()}.${fileExt}`;
    const { client, fetchHandler } = useSupabaseFetch();
    let { data } = await fetchHandler(
        () => client.storage.from("Avatars").upload(path.value, file),
        { onError: "Error uploading file." }
    );

    if (data) {
        const { data: addAvatarData } = await fetchHandler(
            () =>
                client
                    .from("profiles")
                    .update({ avatar_url: path.value })
                    .eq("id", user.value.id),
            { onError: "Error setting avatar for profile" }
        );
        if (addAvatarData) {
            store.setAvatar(path.value);
        }
    }
    uploading.value = false;
};
</script>