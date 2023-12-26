import {defineStore} from "pinia";

export const useDialogStore = defineStore("dialog", {
    state: () => ({
        globalSearch: {
            open: false,
            onSelect: null,
            options: {}
        },
        linescore: {
            open: false,
            editedGame: null,
            options: {},
        },
        leagueEditor: {
            open: false,
            editedLeague: null,
            options: {}
        },
        teamCreator: {
            open: false
        }
        
    }),
  actions: {
    toggleGlobalSearch({open, options = {}}) {
        this.globalSearch.open = open;
        if (open === true) {
            this.globalSearch.options = options;
        } else {
            this.globalSearch.options = {}
        }
    },
    toggleLeagueEditor({open, editedLeague = null, options = {}}) {
        if (!open) {
            this.leagueEditor.editedLeague = null;
            this.leagueEditor.options = {}
        } else {
            this.leagueEditor.editedLeague = editedLeague
            this.leagueEditor.options = options
        }

        this.leagueEditor.open = open;
    },
    toggleLineScore({open, editedGame = null, options = {}}) {
        if (!open) {
            this.linescore.editedGame = null;
            this.linescore.options = {}
        } else {
            this.linescore.editedGame = editedGame
            this.linescore.options = options
        }

        this.linescore.open = open;
    },
    toggleTeamCreator({open}) {
        this.teamCreator.open = open;
    }
  },
});
