import { useRepo } from "pinia-orm";
import Rink from "@/store/models/rink";
import client from "@/service/client";
import { getRink } from "@/service/api/query/rink";
export default (rinkId: number) => {
    const handler = (rink) => {
        if (!!rink) {
            useRepo(Rink).save(rink);
        }
        return rink;
    };
    return async (onChange?: Function) => {
        const data = await client
        .fetch({
            queryFunc: () => getRink(rinkId),
            queryKey: `rink-${rinkId}`,
            onChange: (val) => {
                if (!onChange) return;
                onChange(handler(val));
            },
        })
        .then((val) => handler(val));

        return data
      
    }
       
};
