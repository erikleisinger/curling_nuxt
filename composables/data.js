import {useSessionStore} from "@/store/session";
import {useTeamStore} from "@/store/teams";
import {useGameStore} from "@/store/games";
import {usePlayerStore} from "@/store/players";
import {useShotTypeStore} from "@/store/shotTypes";


export const useData = () => {
  const progress = ref(0)
  const initData = async () => {
      progress.value = 0
      const {fetchShotTypes} = useShotTypeStore()
      const {fetchTeams} = useTeamStore();
      const {fetchPlayers} = usePlayerStore();
      const {fetchGames} = useGameStore()
      const operations = [
        fetchShotTypes,
        fetchTeams,
        fetchPlayers,
        fetchGames
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
    resetSession();
  }
  return {initData, resetData, progress};
};
