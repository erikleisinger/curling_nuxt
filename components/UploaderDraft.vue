<template>
    <input
        type="file"
        class="uploader"
        @change="handleUpload"
        accept="png, jpg"
        :disabled="uploading"
    />
</template>
<style lang="scss" scoped>
.uploader {
    opacity: 0 !important;
    position: absolute;
    height: 100%;
    width: 100%;
}
</style>
<script setup>
import imageCompression from "browser-image-compression";
import { useTeamStore } from "@/store/teams";
import { useNotificationStore } from "@/store/notification";
import Team from "@/store/models/team";
const props = defineProps({
    emitOnly: Boolean,
    resourceType: String,
    resourceId: [Number, String],
});

const emit = defineEmits(["upload", "loading"]);

const uploading = ref(false);
const src = ref("");
const files = ref(null);
const fileUpload = ref(null);

const compressFile = async (file) => {
    const options = {
        maxSizeMB: 0.3,
        // maxWidthOrHeight: 300,
        useWebWorker: true,
    };
    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.log(error);
    }
};

const handleUpload = async (e) => {
    if (!e?.target?.files) return;
    uploading.value = true;
    emit("loading", true);
    if (props.emitOnly) {
        const file = await createFile(e);
        emit("upload", file);
        files.value = null;
    }
    uploading.value = false;
    emit("loading", false);
};

const createFile = async (evt) => {
    files.value = evt.target.files;

    let file = files.value[0];
    file = await compressFile(file);
    if (file.size > MAX_AVATAR_FILE_SIZE) {
        fileUpload.value.value = "";
        throw new Error("File is too large");
    }

    const fileExt = file.name.split(".").pop();
    const path = `${Math.random()}.${fileExt}`;
    return { path, file };
};

const MAX_AVATAR_FILE_SIZE = 2000000;
</script>
<script>
export default {
    name: "FileUpload",
};
</script>
