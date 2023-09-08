<template>
    <div class="rink-sheet__container">
        <!-- RINK SELECTION -->
     
        
              <!-- <div
                    class="row full-height  justify-center items-center icon--floating"
                >
                    <q-icon name="location_on" color="deep-purple" size="2em" />
                </div> -->
           
        <h2 class="text-md text-bold ">Rink</h2>
    
   
        <div class="row q-mb-lg">
            <div
                class="rink__selection"
                v-if="!showSearch"
                @click="toggleGlobalSearch({
                    open: true,
                    options: {
                        callback: selectRink,
                        inputLabel: 'Search for a rink',
                        resourceTypes: ['rink'],

                    }
                })"
            >
              
                <div class="column justify-center rink-selection__name">
                    <div>
                        {{
                            selectedRink
                                ? selectedRink.name
                                : "Click to search"
                        }}
                    </div>
                    <div class="text-xs" v-if="selectedRink">
                        {{
                            selectedRink
                                ? selectedRink.city
                                : "Click to search"
                        }}{{selectedRink && `, ${selectedRink.province}`}}
                    </div>
                </div>
            </div>
        </div>

        <!-- END RINK SELECTION -->

        <!-- BEGIN SHEET SELECTION -->

        <div class="row no-wrap justify-between " v-if="rink">
            <h2 class="text-md text-bold">Sheet</h2>
       
            <q-toggle v-model="letters" label="Letters" dense />
         
        </div>
        <div class="row" v-if="rink">
            <div
                v-for="number in [...Array(rink?.sheets).keys()].map((i) => i + 1)"
                :key="`sheet-${number}`"
                class="sheet__number"
                :class="{ selected: selectedSheet === number }"
                @click="selectedSheet = number"
            >
                <span v-if="!letters">{{ number }}</span>
                <span v-else>{{
                    numberToLetter(number)
                }}</span>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.rink-sheet__container {
    padding: 0px var(--space-md);
    .rink__selection {
        display: grid;
        grid-template-columns: auto 1fr;
        // .rink-selection__name {
        //     margin-left: var(--space-sm);
        // }
    }
    .icon--floating {
        position: absolute;
        left: -2em;
    }
    .rink-search__results {
        position: absolute;
        max-width: 400px;
        max-height: 300px;
        overflow: auto;
        margin-left: var(--space-sm);
        margin-right: var(--space-sm);
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.2);
        padding: 0px var(--space-xs);
        .result__container {
            margin: var(--space-xs) 0;
        }
    }
    .sheet__number {
        padding: var(--space-xs);
        border: 1px solid rgba(0, 0, 0, 0.2);
        margin: var(--space-xs);
        text-align: center;
        border-radius: 4px;
        width: calc(2ch + var(--space-xs) * 2);
        transition: transform 0.1s;
        &.selected {
            color: white;
            background-color: $deep-purple;
            transform: scale(1.1);
            font-weight: bold;
        }
    }
}
</style>
<script setup>
import {useDialogStore} from '@/store/dialog'
import {numberToLetter} from '@/utils/sheets'
const props = defineProps({
    rink: Object,
    sheet: Object,
});

const emit = defineEmits(["update:rink", "update:sheet"]);

const selectedRink = computed({
    get() {
        return props.rink;
    },
    set(val) {
        return emit("update:rink", val);
    },
});

const selectedSheet = computed({
    get() {
        return props.sheet;
    },
    set(val) {
        return emit("update:sheet", val);
    },
});

const showSearch = ref(false);

const selectRink = (rink) => {
    selectedRink.value = rink;
    showSearch.value = false;
};

const letters = ref(false);

const {toggleGlobalSearch} = useDialogStore()
</script>
