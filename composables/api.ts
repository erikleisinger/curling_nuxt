import type { Ref } from 'vue'
export const useApi = () => {
    const defaultFetchOptions = {
        enabled: ref(true),
        onComplete: () => {}
    }
    const fetch = (fetchFunction: Function, {enabled = ref(true), onComplete = () => {}} : {enabled: Ref<boolean>, onComplete: Function} = defaultFetchOptions) => {
        const result = ref(null);
        const loading = ref(true);
  
         
            if (!enabled.value) return {
                result, 
                loading
            }
            fetchFunction(async (val) => {
                const value = await val;
                result.value = value;
            }).then((data) => {
                result.value = data;
                loading.value = false;
    
                onComplete(data)
            })
            .catch((e) => {
                console.log('caught error in api fetch: ',e, {...e}, e.message );
                loading.value = false;
            })
    
            return { result, loading };
     
       
      
        
        
    };

    const mutate = async (mutateFunction: Function) => {


        const data = await mutateFunction();
    

        return data;
    }

    

    return { fetch, mutate };
};
