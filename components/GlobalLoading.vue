<template>
    <div class="window-height window-width row items-center">
        <div style="width: 100vw; position:relative" class="q-mx-lg column items-center">
        <main v-if="!error" class="column items-center full-width">
        <h1 class="q-pb-md text-lg">{{label}} </h1>
        <q-linear-progress rounded  stripe size="10px" :value="value" :indeterminate="infinite" color="deep-purple"></q-linear-progress>
        </main>
        <main v-else class="column items-center full-width">
            <q-icon size="5em" color="negative" name="mood_bad"/>
            <h1 class="q-pt-md text-negative text-lg text-center">{{errorMessage}}</h1>
            <q-btn class="q-mt-md" flat @click="goBack">Go back</q-btn>
        </main>
        </div>
 
    </div>  
</template>
<script setup>
    const props = defineProps({
        error: Boolean,
        errorMessage: {
            type: String,
            default() {
                return 'Error: our curling bots gained sentience and staged an uprising. Awkward!'
            }
        },
        infinite: Boolean,
        label: {
            type: String,
            default() {
                return 'Loading...'
            }
        },
        value: Number
    })
    const goBack = () => {
        reloadNuxtApp({
            path: '/'
        })
    }
</script>
<script>
export default {
    name: 'GlobalLoading'
}
</script>
