import { InjectionKey } from "vue"
import Shot from '@/types/shot'
export const EditedShotInjectionKey: InjectionKey<Ref<Shot>> = Symbol('editedShot')