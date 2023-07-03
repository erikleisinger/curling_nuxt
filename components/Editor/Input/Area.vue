<template>
 <q-form
    @submit="onSave"
    >
<q-card class="q-dialog-plugin">
        <q-card-section   class="row wrap flex-break" >
    
    <div v-for="item in Object.keys(schema)" :key="schema[item].column_name" class="q-pa-sm col-6">
    <EditorInputController :input="schema[item]" v-if="schema[item].visible" :name="item"/>
    </div>

      </q-card-section>
       <q-card-actions>
            <q-btn color="primary" label="Save" type="submit" />
        <q-btn color="primary" label="Cancel" @click="onCancel" />
        </q-card-actions>
</q-card>
         </q-form>
</template>

<script setup>
import {computed } from 'vue'
import { useEditorStore } from "@/store/editor";
import { storeToRefs } from 'pinia'

const emit = defineEmits(['save', 'cancel'])
    const store = useEditorStore();

    const schema = computed(() => store.schema)
    const onSave = async (e) => {
        const formData = new FormData(e.target);
        const data = [...formData.entries()].reduce((all, [key, value]) => {
            return {...all, [key]: value}
        }, {})

        const client = useSupabaseClient();
        const {tableName} = storeToRefs(store)
        const res = await client.from(tableName.value).insert(data)
        console.log('RES: ', res)
        emit('save')
    }
    const onCancel = () => {
        emit('cancel')
    }

    const onValidateSuccess = () => {
        console.log('VALIDATED!')
    }
</script>