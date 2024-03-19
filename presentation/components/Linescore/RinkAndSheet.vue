<template>
<div>
    <div class="rink-sheet__container">
        <!-- TIME SELECTION -->
        <section class="rink-and-sheet__section">
            <div>
            <h2 class="text-md" @click="dateSelectOpen = true">Start time</h2>
            <div>
                {{
                    format(
                        selectedStartTime,
                        "MMMM DD, YYYY [at] h:mm a",
                        false
                    )
                }}
            </div>
            </div>
             <Button icon="edit" round color="mint" size="0.9em" @click="dateSelectOpen = true"/>
        </section>
        <!-- RINK SELECTION -->
        <section class="rink-and-sheet__section ">
            <div>
            <h2 class="text-md">Rink</h2>

            <div class="row ">
                <div
                    class="rink__selection"
                    v-if="!showSearch"
                   
                >
                    <div class="column justify-center rink-selection__name">
                        <div>
                            {{
                                (selectedRink && selectedRink?.name) ||
                                "No rink selected"
                            }}
                        </div>
                        <div class="text-xs" v-if="selectedRink?.id">
                            {{
                                selectedRink
                                    ? selectedRink.city
                                    : "Click to search"
                            }}{{ selectedRink && `, ${selectedRink.province}` }}
                        </div>
                    </div>
                </div>
            </div>
            </div>
           <Button icon="edit" round color="mint" size="0.9em"  @click="
                        toggleGlobalSearch({
                            open: true,
                            options: {
                                callback: selectRink,
                                inputLabel: 'Search for a rink',
                                resourceTypes: ['rink'],
                            },
                        })
                    "/>
        </section>

        <!-- END RINK SELECTION -->

        <!-- BEGIN SHEET SELECTION -->
        <section class="rink-and-sheet__section" v-if="rink?.id">
            <div>
            <div class="row no-wrap justify-between" >
                <h2 class="text-md">Sheet</h2>

                <!-- <q-toggle v-model="letters" label="Letters" dense :style="{color: getColor('mint')}" /> -->
            </div>
            <div class="row" v-if="rink?.id">
                <div
                    v-for="number in [...Array(rink?.sheet_count).keys()].map(
                        (i) => i + 1
                    )"
                    :key="`sheet-${number}`"
                    class="sheet__number"
                    :class="{ selected: selectedSheet?.number === number }"
                    @click="selectSheet(number)"
                >
                    <span v-if="!letters">{{ number }}</span>
                    <span v-else>{{ numberToLetter(number) }}</span>
                </div>
            </div>
            </div>
            <Button icon="edit" round color="mint"/>
        </section>
    </div>
    <InputDate
        v-if="dateSelectOpen"
        v-model="selectedStartTime"
        @hide="dateSelectOpen = false"
    />
</div>
</template>
<style lang="scss" scoped>
.rink-sheet__container {
    padding: 0px var(--space-md);
    padding-top: var(--space-sm);
    @include sm {
        padding: 0px var(--space-xl);
        padding-top: var(--space-sm);
    }

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
        border: 1px solid rgba(0, 0, 0, 0.1);
        margin: var(--space-xs);
        text-align: center;
        border-radius: 4px;
        width: calc(2ch + var(--space-xs) * 2);
        transition: transform 0.1s;
        &.selected {
            color: white;
            background-color: $app-mint;
            transform: scale(1.1);
            font-weight: bold;
        }
    }

    .rink-and-sheet__section {
        margin-top: var(--space-md);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { numberToLetter } from "@/business/utils/sheet";
const props = defineProps({
    rink: Object,
    sheet: Object,
    startTime: String,
});

const emit = defineEmits(["update:rink", "update:sheet", "update:start_time"]);



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

const selectSheet = (number) => {
    if (selectedSheet.value) {
        selectedSheet.value.number = number;
    } else {
        selectedSheet.value = {
            number
        }
    }
}

const selectedStartTime = computed({
    get() {
        return props.startTime;
    },
    set(val) {
        return emit("update:start_time", val);
    },
});

const showSearch = ref(false);

const selectRink = (rink) => {
    selectedRink.value = rink;
    showSearch.value = false;
};

const letters = ref(false);

const { toggleGlobalSearch } = useDialogStore();

const { format } = useTime();
const dateSelectOpen = ref(false);

const {getColor} = useColor();
</script>
