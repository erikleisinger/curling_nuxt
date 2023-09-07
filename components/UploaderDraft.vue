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
    opacity: 0!important;
    position: absolute;
    height: 100%;
    width: 100%;
}
</style>
<script setup>
import imageCompression from "browser-image-compression";
import {useTeamStore} from '@/store/teams'
import {useNotificationStore} from '@/store/notification'
import Team from '@/store/models/team'
const props = defineProps({
    emitOnly: Boolean,
    resourceType: String,
    resourceId: [Number, String],
});

const emit = defineEmits(["upload"]);

const uploading = ref(false);
const src = ref("");
const files = ref(null);
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

const handleUpload = async (e) => {
    uploading.value = true;
    console.log('UPLOAD: ', props.emitOnly)
    if (props.emitOnly) {
        const file = await createFile(e)
        emit('upload', file)
        files.value = null
    } else {

    }
    uploading.value = false;
}

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
        return {path, file}
}

const MAX_AVATAR_FILE_SIZE = 35000;

const uploadAvatar = async (evt) => {
    files.value = evt.target.files;
    if (!files.value || files.value.length === 0) return;

    const notStore = useNotificationStore();
    const notId = notStore.addNotification({
        state: "pending",
        text: `Uploading avatar...`,
        timeout: 10000,

    });
    try {
        const {path, file} = await createFile(evt)
        if (props.resourceType === "team") {
            const {updates} = await useTeamStore().uploadAvatarToTeam(path, file, props.resourceId)
            useRepo(Team).where('id', props.resourceId).update(updates)
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



</script>
