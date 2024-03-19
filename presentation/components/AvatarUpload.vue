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
import { compressFile } from "@/business/utils/file";
import { FileUpload } from "@/business/types/file/FileUpload";

const emit = defineEmits(["upload", "loading"]);

const uploading = ref(false);
const files = ref(null);

const { runNotifyFunction } = useNotification();

const handleUpload = async (e) => {
    if (!e?.target?.files) return;
    uploading.value = true;
    emit("loading", true);
    const file = await runNotifyFunction({
        callback: () => createFile(e),
        onProgress: "Generating avatar...",
        onSuccess: "Avatar generated",
    });
    emit("upload", file);
    files.value = null;

    uploading.value = false;
    emit("loading", false);
};

const createFile = async (evt) => {
    files.value = evt.target.files;
    let file = files.value[0];
    file = await compressFile(file);
    const fileUpload = new FileUpload(file);
    fileUpload.validate();
    return fileUpload;
};
</script>
<script>
export default {
    name: "FileUpload",
};
</script>
