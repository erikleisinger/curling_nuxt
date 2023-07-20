import {defineStore} from "pinia";
import {Dialog} from "quasar";

import DialogGameEditor from "@/components/Dialog/GameEditor.vue";
import DialogPlayerEditor from "@/components/Dialog/PlayerEditor.vue";
import DialogTeamEditor from "@/components/Dialog/TeamEditor.vue";
import DialogRinkEditor from '@/components/Dialog/RinkEditor.vue'
import  DialogSheetEditor  from "@/components/Dialog/SheetEditor.vue";

import  DialogShotTypeEditor  from "@/components/Dialog/ShotTypeEditor.vue";


export const useEditorStore = defineStore("editor", {
  actions: {
    toggleGameDialog(edited) {
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
    },
    toggleRinkDialog(edited) {
        Dialog.create({
          component: DialogRinkEditor,
          componentProps: {
            edited,
          }
        });
      },
      toggleSheetDialog(edited) {
        Dialog.create({
          component: DialogSheetEditor,
          componentProps: {
            edited,
          }
        });
      },
    toggleShotTypeDialog(edited) {
      Dialog.create({
        component: DialogShotTypeEditor,
        componentProps: {
          edited,
        }
      });
    }
  },
});
