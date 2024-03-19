<template>
    <div class="row" style="gap: 2px">
        <div
            v-for="number in [...Array(rink?.sheet_count).keys()].map((i) => i + 1)"
            :key="`sheet-${number}`"
            class="sheet__number clickable"
            :class="{disabled: !sheets?.some(({number: sheetNumber}) => sheetNumber === number), selected: sheets?.find(({id}) => id === selectedSheet)?.number === number}"
            @click="selectSheet(number)"
        >
            <span>{{ number }}</span>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.sheet__number {
    padding: 4px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    color: white;
    aspect-ratio: 1/1;
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 6px;
    &.selected {
        background-color: $app-mint;
        font-weight: bold;
    }
    &.disabled {
        color: rgba(255,255,255,0.5);
         background-color: rgba(255, 255, 255, 0.2);
    }
}
</style>
<script setup>
import Rink from "@/store/models/rink";
import Sheet from "@/store/models/sheet";
import { useQuery } from "@tanstack/vue-query";

const props = defineProps({
    modelValue: Number,
    rinkId: Number,
});

const emit = defineEmits(['update:modelValue']);

const selectedSheet = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})

const rink = computed(() => useRepo(Rink).where("id", props.rinkId).first());

const getSheetsForRink = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("sheets")
        .select("*")
        .eq("rink_id", props.rinkId);
    return data;
};

const {rinkId} = toRefs(props)

const { isLoading, data: sheets } = useQuery({
    queryKey: ["rink", "sheets", rinkId],
    queryFn: getSheetsForRink,
    refetchOnWindowFocus: false,
});

const selectSheet = (num) => {
    const sheet = sheets.value.find(({number}) => number === num)
    if (!sheet) return;

    const {id} = sheet;
    if (selectedSheet.value === id) {
        selectedSheet.value = null
    } else {
selectedSheet.value = id;
    }
    
}
</script>
