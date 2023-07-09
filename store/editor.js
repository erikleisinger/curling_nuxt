import {defineStore} from "pinia";
import {Dialog} from "quasar";
import {TABLE_SCHEMA} from "@/constants/tables";

import EditorDialog from "@/components/Editor/Dialog.vue";
import GameEditorDialog from "@/components/Game/EditorDialog.vue";

const defaultState = () => {
  return {
    game: false,
    schema: {},
    table: "",
  };
};
export const useEditorStore = defineStore("editor", {
  state: () => {
    return defaultState();
  },
  getters: {
    tableName: (state) => {
      return state.table;
    },
  },
  actions: {
    init(tableName, dialog = false) {
      const schema = TABLE_SCHEMA[tableName];
      if (!schema) return;
      this.schema = schema;
      this.table = tableName;
      if (dialog) this.openDialog();
    },
    openDialog() {
      Dialog.create({
        component: EditorDialog,
        componentProps: {
          schema: this.schema,
        },
      });
    },
    toggleGameDialog(edited) {
      Dialog.create({
        component: GameEditorDialog,
        componentProps: {
          edited,
        }
      });
    },
  },
});
