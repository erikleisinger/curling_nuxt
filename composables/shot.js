import {computed, ref, watch} from 'vue'
import {useGameStore} from '@/store/game'

export const useShot = () => {
    const store = useGameStore();
    const shot = ref({})
const {getShot, saveShot} = store;

const gamePos = computed(() => {
    const {end, shot:shotNo} = store;
    return {end, shotNo}
})
watch(gamePos, async () => {

    shot.value = await getShot(shot.value)
}, {deep: true, immediate:true})
return shot;
}