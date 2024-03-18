import {useUserStore} from '@/store/user'
import {useUserTeamStore} from '@/store/user-teams'
import { useGameRequestStore } from "@/store/game-requests";

export const useData = () => {
    const userStore = useUserStore();
    const userTeamStore = useUserTeamStore();
  const progress = ref(0)

  const initData = async () => {
      progress.value = 0
      const {getCurrentUser} = userStore;
      const {fetchUserTeams} = userTeamStore;
      const {getGameRequestsByUser} = useGameRequestStore();

      await getCurrentUser()

      const operations = [
        // () => fetchRinks(),
        () => fetchUserTeams(true),
        () => getGameRequestsByUser(userStore.id)
       
      ];
      const incrementValue = 1 / operations.length;
      const promises = operations.map(
        (operation) =>
          new Promise((resolve) => {
            operation().then(() => {
              progress.value += incrementValue;
              resolve();
            });
          })
      );
      await Promise.all(promises);
  };


  const verifyData = async () => {
    try {
        /**
         * Verify that the current user has been fetched and its data is available.
         */
        const userChecks = [
            'id',
            'username'
        ];
    
        userChecks.forEach((key) => {
            if (!userStore[key]) throw new Error(`Key does not exist on user: ${key}`)
        })

        /**
         * Verify that players exist and are available in store
         */

        /**
         * Verify that 
         */
        // if (!playerStore.players.length) throw new Error('PLAYERS not populated')

        // if (!teamStore.teams.length) throw new Error('TEAMS not populated')

        
    } catch(e) {
        console.error(e)
    }
  }
  return {initData, progress, verifyData};
};
