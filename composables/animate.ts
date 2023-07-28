
import type {Ref} from 'vue'
export const useAnimate = () => {
    const upTick = (ref: Ref , max:number, speed = 10) => {
        if (!max || !Number(max)) return;
        if (ref.value >= max) return;
        ref.value +=1;
        setTimeout(() => {
        upTick(ref, max, speed);
        },speed)
       
    }

    return {upTick}
    
}