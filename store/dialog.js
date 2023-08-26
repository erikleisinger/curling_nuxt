import {defineStore} from "pinia";
import {Dialog} from "quasar";

import DialogGameEditor from "@/components/Dialog/GameEditor.vue";
import DialogRinkEditor from '@/components/Dialog/RinkEditor.vue'
import  DialogSheetEditor  from "@/components/Dialog/SheetEditor.vue";

export const useDialogStore = defineStore("dialog", {
    state: () => ({
        mousePos: {
            x: 0,
            y: 0,
        },
        globalSearch: {
            open: false,
            onSelect: null,
            options: {}
        },
        linescore: {
            open: false,
            editedGame: null,
        },
        playerSelect: {
            open: false,
            onSelect: null,
        },
        playerEditor: {
            open: false,
            editedPlayer: null,
        },
        teamViewer: {
            open: false,
            team: null,
            options: {}
        }
        
    }),
  actions: {
    setMousePos(e) {
        console.log('set mouse pos: ', e)
    },
    toggleGameDialog(edited) {
      Dialog.create({
        component: DialogGameEditor,
        componentProps: {
          edited,
        }
      });
    },
    toggleGlobalSearch({open, options = {}}) {
        this.globalSearch.open = open;
        if (open === true) {
            this.globalSearch.options = options;
        } else {
            this.globalSearch.options = {}
        }
    },
    toggleLineScore({open, editedGame = null}) {
        if (open === false || !editedGame) {
            this.linescore.editedGame = null;
        } else {
            this.linescore.editedGame = editedGame
        }

        this.linescore.open = open;
    },
    togglePlayerEditor({editedPlayer = null, open}) {
        if (open === false) {
            this.playerEditor.open = false;
            this.playerEditor.editedPlayer = null
        } else {
            this.playerEditor.open = true;
            this.playerEditor.editedPlayer = editedPlayer
        }
    },
    togglePlayerSelect({onSelect = null, open}) {
        if (open === false) {
            this.playerSelect.open = false;
            this.playerSelect.onSelect = false
        } else {
            if (!onSelect) {
                console.error('cant open player select: no onSelect callback provided');
                return;
            }
            this.playerSelect.open = true;
            this.playerSelect.onSelect = onSelect
        }
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
    toggleTeamViewer({team, open, options = {}}) {
        if (open === false) {
            this.teamViewer.open = false;
            this.teamViewer.team = null
            this.teamViewer.options = {};
        } else {
            this.teamViewer.open = true;
            this.teamViewer.team = team
            this.teamViewer.options = options;
        }
    }
  },
});
