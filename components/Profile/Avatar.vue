<template>
    <div
        class="profile-picture row justify-center items-center"
        :style="{ height: `${size || 1}em`, width: `${size || 1}em` }"
    >
        <q-circular-progress
            indeterminate
            v-if="loading || downloading"
            color="grey-8"
            size="1em"
        />
        <q-icon
            name="file_upload"
            size="md"
            color="grey"
            v-else-if="!src && upload"
        />
        <q-icon
            v-else-if="!src"
            name="person"
            :size="`${size / 2}em`"
            color="grey"
        />

        <img
            v-else
            :src="src"
            alt="Avatar"
            class="avatar"
            :style="{ height: size + 'em', width: size + 'em' }"
        />
    </div>
</template>
<style lang="scss" scoped>
.profile-picture {
    border: 1px solid #ddd;
    border-radius: 50%;
    background: #eee;
    position: relative;
    overflow: hidden;
    .avatar {
        border-radius: 50%;
    }
}
</style>
<script setup>
const props = defineProps({
    path: String,
    loading: Boolean,
    size: String,
    upload: Boolean,
});
const src = ref("");
const downloading = ref(false);

const downloadImage = async () => {
    downloading.value = true;
    const { client, fetchHandler } = useSupabaseFetch();

    const { data } = await fetchHandler(
        () => client.storage.from("Avatars").download(props.path),
        { onError: "Error getting avatar." }
    );
    if (data) {
        src.value = URL.createObjectURL(data);
    }

    downloading.value = false;
};

const propsPath = computed(() => props.path);
watch(
    propsPath,
    (v) => {
        if (!v) return;
        console.log("PROPS PATH CHANGED: ", v);
        downloadImage();
    },
    { immediate: true }
);
</script>
