import { defineStore } from 'pinia';
import {VIEWS} from '@/constants/navigation'
export const useNavigationStore = defineStore('navigation', {
    state: () => {
        return {
          editGame: false,
          view: VIEWS.SEASON
        };
      },
    actions: {
       setEditGame(bool:boolean) {
        this.editGame = bool;
       },   
       setView(view: string) {
        this.view = view;
       }
       
    }
})