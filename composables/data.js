import {useSessionStore} from "@/store/session";
import {useTeamStore} from "@/store/teams";
import {useGameStore} from "@/store/games";
import {usePlayerStore} from "@/store/players";
import {useShotTypeStore} from "@/store/shotTypes";


export const useData = () => {
  const progress = ref(0)
  const initData = async () => {
 
    const {fetchShotTypes} = useShotTypeStore()
    const {fetchTeams} = useTeamStore();
    const {fetchPlayers} = usePlayerStore();
    const {fetchGames} = useGameStore()
    
    await fetchShotTypes();
    progress.value += .25
    await fetchTeams();
    progress.value += .25
    await fetchPlayers();
    progress.value += .25
    await fetchGames();
    progress.value += .25
  };
  const resetData = () => {
    const {resetSession} = useSessionStore();
    resetSession();
  }
  return {initData, resetData, progress};
};
