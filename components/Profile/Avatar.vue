<template>
    <div
        class="profile-picture row justify-center items-center box-shadow--dark"
        :style="{ height: dimensions, width: dimensions }"
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

        <nuxt-img
            v-else
            :src="src"
            alt="Avatar"
            quality="1"
            class="avatar"
        />
        <slot/>
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
         width:100%;
    height:100%;
    object-fit: cover;
    overflow: hidden;
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

    const { data } = await fetchHandler(() => client.storage.from("Avatars").download(props.path));
    try {
  src.value = URL.createObjectURL(data);    
    } catch {
 downloading.value = false;
    }
       downloading.value = false;
    
   
};

const propsPath = computed(() => props.path);
watch(
    propsPath,
    (v) => {
        if (!v) return;
        downloadImage();
    },
    { immediate: true }
);
const dimensions = computed(() => `${props.size}em`)
</script>
