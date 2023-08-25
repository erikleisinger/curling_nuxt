<template>
    <input
        type="file"
        class="uploader"
        @change="uploadAvatar"
        accept="png, jpg"
        :disabled="uploading"
    />
</template>
<style lang="scss" scoped>
.uploader {
    opacity: 0;
    position: absolute;
    height: 100%;
    width: 100%;
}
</style>
<script setup>
import imageCompression from "browser-image-compression";
import { useNotificationStore } from "@/store/notification";
const props = defineProps({
    resourceType: String,
    resourceId: [Number, String],
});

const uploading = ref(false);
const src = ref("");
const files = ref();
const path = ref("");
const fileUpload = ref(null);

const onChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        // Get uploaded file
        const file = e.target.files[0],
            // Get file size
            fileSize = Math.round((file.size / 1024 / 1024) * 100) / 100,
            // Get file extension
            fileExtention = file.name.split(".").pop(),
            // Get file name
            fileName = file.name.split(".").shift(),
            // Check if file is an image
            isImage = ["jpg", "jpeg", "png", "gif"].includes(fileExtention);
        // Print to console
        console.log(fileSize, fileExtention, fileName, isImage);
    }
};

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

const MAX_AVATAR_FILE_SIZE = 35000;

const uploadAvatar = async (evt) => {
    files.value = evt.target.files;
    if (!files.value || files.value.length === 0) return;
    uploading.value = true;
    const notStore = useNotificationStore();
    const notId = notStore.addNotification({
        state: "pending",
        text: `Uploading avatar...`,
        timeout: 10000,
    });
    try {
        files.value = evt.target.files;
        uploading.value = true;

        let file = files.value[0];
        file = await compressFile(file);
        if (file.size > MAX_AVATAR_FILE_SIZE) {
            fileUpload.value.value = "";
            throw new Error("File is too large");
        }

        const fileExt = file.name.split(".").pop();
        path.value = `${Math.random()}.${fileExt}`;
        if (props.resourceType === "team") {
            await uploadAvatarToTeam(path.value, file);
        }
        notStore.updateNotification(notId, {
            state: "completed",
            text: "Avatar updated!",
            timeout: 3000,
        });
    } catch (e) {
        notStore.updateNotification(notId, {
            state: "failed",
            text: `Error uploading avatar: ${e.message} (code ${
                e?.code ?? "X"
            })`,
            timeout: 10000,
        });
    }

    uploading.value = false;
};

const emit = defineEmits("upload");

const uploadAvatarToTeam = async (fileName, file) => {
    const client = useSupabaseClient();

    const { errors } = await client.storage
        .from("Avatars")
        .upload(fileName, file);
    if (errors) throw new Error(errors);

    const { errors: errors2 } = await client
        .from("teams")
        .update({ avatar_type: "upload", avatar_url: fileName })
        .eq("id", props.resourceId);

    if (errors2) throw new Error(errors2);
    emit("upload");
};
</script>
