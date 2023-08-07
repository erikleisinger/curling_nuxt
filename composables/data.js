import {useSessionStore} from "@/store/session";
import {useTeamStore} from "@/store/teams";
import {useGameStore} from "@/store/games";
import {usePlayerStore} from "@/store/players";
import {useShotTypeStore} from "@/store/shotTypes";
import {useUserStore} from '@/store/user'
import { useFriendStore } from "@/store/friends";
import {useRinkStore} from '@/store/rinks'
import {useSheetStore} from '@/store/sheets'
import {useSocialStore} from '@/store/social'

export const useData = () => {
    const shotTypeStore = useShotTypeStore();
    const teamStore = useTeamStore();
    const playerStore = usePlayerStore();
    const gameStore = useGameStore();
    const friendStore = useFriendStore();
    const userStore = useUserStore();
    const rinkStore = useRinkStore();
    const sheetStore = useSheetStore()
    const socialStore = useSocialStore();
  const progress = ref(0)

  const initData = async () => {
      progress.value = 0
      const {fetchShotTypes} = shotTypeStore
      const {fetchTeams} = teamStore;
      const {fetchPlayers} = playerStore;
      const {fetchGames} = gameStore
      const {getFriends} = friendStore;
      const {getCurrentUser} = userStore;
      const {fetchRinks} = rinkStore;
      const {fetchSheets} = sheetStore;
      const {fetchTeamRequests } = socialStore

      await getCurrentUser()

      const operations = [
        () => fetchTeamRequests(),
        () => fetchShotTypes(true),

        () => fetchPlayers(true),
        () => fetchGames(true),

        () => getFriends(true),
        () => fetchRinks(true),
        () => fetchSheets(true),
        () => fetchTeams(true)
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
        if (!playerStore.players.length) throw new Error('PLAYERS not populated')

        let friendId = playerStore.players.find(({profile_id}) => profile_id !== userStore.id)?.profile_id

        if (!teamStore.teams.length) throw new Error('TEAMS not populated')

        if (!friendId) {
            friendId = teamStore.teams.find(({profile_id}) => profile_id !== id)?.profile_id
        }

        if (!friendId) {
            friendId = gameStore.games.find(({profile_id}) => profile_id !== id)?.profile_id
        }
        if (friendId) {
            if (!friendStore.friends[friendId] || !friendStore.friends[friendId].username) {
                throw new Error('FRIENDS not populated');
            }
            
        }
        
    } catch(e) {
        console.error(e)
    }
  }
  return {initData, resetData, progress, verifyData};
};
