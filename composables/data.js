import {useSessionStore} from "@/store/session";
import {useTeamStore} from "@/store/teams";
import {useGameStore} from "@/store/games";
import {usePlayerStore} from "@/store/players";
import {useUserStore} from '@/store/user'
import {useTeamRequestStore} from '@/store/team-requests'
import {useUserTeamStore} from '@/store/user-teams'

export const useData = () => {
    const teamStore = useTeamStore();
    const playerStore = usePlayerStore();
    const userStore = useUserStore();
    const userTeamStore = useUserTeamStore();
  const progress = ref(0)

  const initData = async () => {
      progress.value = 0
      const {getCurrentUser} = userStore;
      const {fetchUserTeams} = userTeamStore;
      const {getTeamRequestsByUser} = useTeamRequestStore();

      await getCurrentUser()

      const operations = [
        () => fetchUserTeams(true),
        () => getTeamRequestsByUser(userStore.id)
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
  const resetData = () => {
    const {resetSession} = useSessionStore();
    const {resetPlayers} = usePlayerStore();
    const {resetTeams} = useTeamStore();
    const {resetGames} = useGameStore();
    resetSession();
    resetPlayers();
    resetTeams();
    resetGames();
  }

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
  return {initData, resetData, progress, verifyData};
};
