<template>

<div class="rink-sheet__container">
    <!-- RINK SELECTION -->
<h2 class="text-md text-bold">Select a rink</h2>
    <div>
        <div
            class="rink__selection"
            v-if="!showSearch"
            @click="showSearch = true"
        >
            <div class="row full-height full-width justify-center items-center">
                <q-icon name="location_on" color="deep-purple" size="2em" />
            </div>
            <div class="column justify-center rink-selection__name">
                <div>{{selectedRink ? selectedRink.name : 'No rink selected'}}</div>
                <div class="text-xs">{{selectedRink ? selectedRink.location : 'Click to search'}}</div>
            </div>
        </div>
        <AreaSearch
            v-if="showSearch"
            :query="`
                id,
                name,
                location
                `"
            tableName="rinks"
            queryField="name"
            globalOnly
            inputLabel="Search for a rink"
        >
            <template v-slot="{ results }">
                <div class="rink-search__results" v-if="results?.length" >
                    <div
                        v-for="result in results"
                        :key="result.id"
                        class="result__container"
                        @click="selectRink(result)"
                    >
                        <div>
                            {{ result.name }}
                        </div>
                        <div class="text-xs">
                            {{ result.location }}
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:before>
                <q-btn flat round icon="close" @click="showSearch = false" />
            </template>
        </AreaSearch>
    </div>

    <!-- END RINK SELECTION -->

    <!-- BEGIN SHEET SELECTION -->

<div class="row no-wrap justify-between items-center"><h2 class="text-md text-bold">Select a sheet</h2><q-toggle v-model="letters" label="Letters"/></div>
<div class="row">
    <div v-for="number in [...Array(26).keys()].map((i) => i + 1)" :key="`sheet-${number}`" class="sheet__number" :class="{selected: selectedSheet === number}" @click="selectedSheet = number">
        <span v-if="!letters">{{number}}</span>
        <span v-else>{{String.fromCharCode(97 + number - 1).toUpperCase()}}</span>
    </div>
</div>
</div>

</template>
<style lang="scss" scoped>
.rink-sheet__container {
    padding: 0px var(--space-md);
.rink__selection {
    height: 96px;
    display: grid;
    grid-template-columns: auto 1fr;
    .rink-selection__name {
        margin-left: var(--space-sm);
    }
    
}
.rink-search__results {
    position: absolute;
    max-width: 400px;
    max-height: 300px;
    overflow: auto;
    margin-left: var(--space-sm);
    margin-right: var(--space-sm);
    background-color:white;
    border: 1px solid rgba(0,0,0,0.2);
    padding: 0px var(--space-xs);
    .result__container {
        margin: var(--space-xs) 0;
    }
}
.sheet__number {
    padding: var(--space-xs);
    border: 1px solid rgba(0,0,0,0.2);
    margin: var(--space-xs);
    text-align:center;
    border-radius: 4px;
    width: calc(2ch + var(--space-xs) * 2);
    transition: transform 0.1s;
    &.selected {
        color: white;
        background-color:$deep-purple;
        transform: scale(1.1);
        font-weight: bold;

    }
}
}

</style>
<script setup>

const props = defineProps({
    rink: Object,
    sheet: Object,
})

const emit = defineEmits(['update:rink', 'update:sheet'])

const selectedRink = computed({
    get() {
        return props.rink
    },
    set(val) {
        return emit('update:rink', val)
    }
})

const selectedSheet = computed({
    get() {
        return props.sheet
    },
    set(val) {
        return emit('update:sheet', val)
    }
})

const showSearch = ref(false);


const selectRink = (rink) => {
    selectedRink.value = rink;
    showSearch.value = false;
}

const letters = ref(false)
</script>
