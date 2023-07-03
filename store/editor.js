import { defineStore } from 'pinia';
import { Dialog } from 'quasar'
import { TABLE_SCHEMA } from '@/constants/tables';

import EditorDialog from '@/components/Editor/Dialog.vue'

const defaultState = () => {
    return {
        schema: {},
        table: '',
    }
};
export const useEditorStore = defineStore('editor', {
    state: () => {
        return defaultState();
    },
    getters: {
        tableName:(state) => {
            return state.table;
        }
    },
    actions: {
        init(tableName, dialog = false) {
            const schema =TABLE_SCHEMA[tableName]
            if(!schema) return;
            console.log(TABLE_SCHEMA[tableName])
            this.schema = schema
            this.table = tableName
            if (dialog) this.openDialog()
        },
        openDialog() {
            Dialog.create({
                component: EditorDialog,
                componentProps: {
                  schema: this.schema,
                },
              })
        },
    }
})