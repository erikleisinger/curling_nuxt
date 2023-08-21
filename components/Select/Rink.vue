<template>
    <AreaSearch
        :globalOnly="true"
        :hideIcons="true"
        :hideHint="true"
        inputLabel="Search for a rink"
        :query="searchQuery"
        tableName="rinks"
         v-slot="{ results }"
    >
    <div v-for="result in results" :key="result.id" @click="setRink(result)">
 
        <div>{{result.name}}</div>
        <div class="text-sm">{{result.location}}</div>

    </div>  

    </AreaSearch>
    <!-- <q-select
    outlined
    rounded
    :options="rinkOptions"
    v-model.number="editedRink"
    emit-value
    map-options
    :disable="globalLoading"
    use-input
    input-debounce="0"
    @input-value="onInput"
    ref="rinkSelect"
  >
  <template v-slot:selected v-if="!editedRink  && input">
       <q-chip class="glossy" color="positive" text-color="white" icon-right="add_circle_outline" style="order:1" @click="addRink" :clickable="!inserting">
        {{input}}
      </q-chip>
  </template>
  <template v-slot:before-options>
    <q-item>
        <q-item-section>
        <q-item-label>Type the name of a rink to search for it, or create a new one.</q-item-label>
        </q-item-section>
    </q-item>
  </template>   
    <template v-slot:append>
      <q-btn
        flat
        round
        @click.stop="getRinks(true)"
        :loading="loadingRinks"
      >
        <q-icon name="refresh" />
      </q-btn>
    </template>
  </q-select> -->
</template>
<script setup lang="ts">
import { useRinkStore } from "@/store/rinks";
import type Rink from "@/types/rink";
type FilterFunction = (arg: Rink) => boolean;
const props = defineProps<{
    modelValue: number | null | undefined;
    filter?: FilterFunction;
}>();
const emit = defineEmits(["update:modelValue"]);
const editedRink = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});
const store = useRinkStore();
const loadingRinks = ref(false);
const { fetchRinks } = store;
const getRinks = async (force: boolean) => {
    loadingRinks.value = true;
    await fetchRinks(force);
    loadingRinks.value = false;
};

const { formatPlayerForSelection } = useFormat();
const rinkOptions = computed(() => {
    let rinks = [...store.rinks];
    if (props.filter) {
        rinks = rinks.filter(props.filter);
    }
    return rinks.map((d) => formatPlayerForSelection(d));
});
const { globalLoading } = useLoading();

const input = ref("");
const onInput = (e: string) => {
    input.value = e;
};

const rinkSelect = ref(null);
const inserting = ref(false);
const addRink = async () => {
    inserting.value = true;
    const newRink = {
        name: input.value,
    };
    const rink = await store.insertRink(newRink);
    editedRink.value = rink?.id;

    inserting.value = false;
    nextTick(() => {
        rinkSelect.value.blur();
        rinkSelect.value.hidePopup();
    });
};

const searchQuery = `
                id,
                name,
                location
                `;

const setRink = (rink) => {
    console.log('rink: ', rink)
}
</script>
