import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('navigation', {
    state: () => {
        return {
          editGame: false,
        };
      },
    actions: {
       setEditGame(bool:boolean) {
        this.editGame = bool;
       }
       
    }
})