<template>
       <q-select
            rounded
            outlined
            class="col-9 q-pl-sm q-pb-md"
            label="Home"
            :options="teamOptions"
            v-model="selectedTeam"
            emit-value
            map-options
            name="home"
            aria-required="true"
            :rules="[VALIDATION_RULES.REQUIRED]"
          >
          <template v-slot:selected-item="{opt}">
            <div class="truncate-text">{{opt.label}}</div>
          </template>
   <template v-slot:append>
      <q-btn
        flat
        round
        @click.stop="toggleTeamDialog(null)"
    
      >
        <q-icon name="add_circle_outline" />
      </q-btn>
    </template>
          </q-select>
</template>
<script setup>
import {VALIDATION_RULES} from "@/constants/validation";
import { useEditorStore } from "@/store/editor";
import {useTeamStore} from "@/store/teams";

const props = defineProps({
    modelValue: Number,
})
const emit = defineEmits(['update:modelValue'])
const selectedTeam = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})
    const teamStore = useTeamStore();
const teamOptions = computed(() => {
  return teamStore.teams.map((t) => {
    return {
      label: t.name || "Unnamed team",
      value: t.id,
    };
  });
});

const {toggleTeamDialog} = useEditorStore();
</script>