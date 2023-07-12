import {defineStore} from "pinia";
import {Dialog} from "quasar";
import {TABLE_SCHEMA} from "@/constants/tables";

import EditorDialog from "@/components/Editor/Dialog.vue";
import DialogGameEditor from "@/components/Dialog/GameEditor.vue";
import DialogPlayerEditor from "@/components/Dialog/PlayerEditor.vue";
import DialogTeamEditor from "@/components/Dialog/TeamEditor.vue";

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
      console.log('TOGGLE GAME: ', edited)
      Dialog.create({
        component: DialogGameEditor,
        componentProps: {
          edited,
        }
      });
    },
    togglePlayerDialog(edited) {
      Dialog.create({
        component: DialogPlayerEditor,
        componentProps: {
          edited,
        }
      });
    },
    toggleTeamDialog(edited) {
      Dialog.create({
        component: DialogTeamEditor,
        componentProps: {
          edited,
        }
      });
    }
  },
});
