import type { Ref } from 'vue'
export const useApi = () => {
    const defaultFetchOptions = {
        enabled: ref(true),
        onComplete: () => {},
        errorMsg: 'Error occured.'
    }
    const fetch = (fetchFunction: Function, {enabled = ref(true), onComplete = () => {}, errorMsg = 'Error occured.'} : {enabled: Ref<boolean>, onComplete: Function, errorMsg?: string} = defaultFetchOptions) => {
        const result = ref(null);
        const loading = ref(true);
        const error = ref(null)
  
         
            if (!enabled.value) return {
                result, 
                loading
            }
            fetchFunction(async (val) => {
                error.value = null;
                const value = await val;
                result.value = value;
            }).then((data) => {
                error.value = null;
                result.value = data;
                loading.value = false;
    
                onComplete(data)
            })
            .catch((e) => {
                console.log('caught error in api fetch: ',e, {...e}, e.message );
                error.value = errorMsg;
                loading.value = false;
            })
    
            return { result, loading, error };
     
       
      
        
        
    };

    const mutate = async (mutateFunction: Function) => {


        const data = await mutateFunction();
    

        return data;
    }

    

    return { fetch, mutate };
};
