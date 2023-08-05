import { defineStore } from 'pinia';
import {VIEWS} from '@/constants/navigation'
export const useNavigationStore = defineStore('navigation', {
    state: () => {
        return {
          editGame: false,
          focusTeam: null,
          view: VIEWS.SEASON
        };
      },
    actions: {
       setEditGame(bool:boolean) {
        this.editGame = bool;
       },   
       setTeamFocus(id: number) {
        this.focusTeam = id;
       },
       setView(view: string) {
        this.view = view;
       }
       
    }
})