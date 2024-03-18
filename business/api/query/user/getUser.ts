import client from "@/service/client";
import { getUser } from "@/service/api/query/user";
export default (userId: string) => {

    return async (onChange?: Function) => {
        const data = await client
        .fetch({
            queryFunc: () => getUser(userId),
            queryKey: `user-${userId}`,
            onChange: (val) => {
                if (!onChange) return;
                onChange(val);
            },
        })

        return data
      
    }
       
};
