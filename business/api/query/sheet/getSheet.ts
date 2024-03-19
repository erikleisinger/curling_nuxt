import { useRepo } from "pinia-orm";
import Sheet from "@/store/models/sheet";
import client from "@/service/client";
import { getSheet } from "@/service/api/query/sheet";
export default (sheetId: number) => {
    const handler = (sheet) => {
        if (!!sheet) {
            useRepo(Sheet).save(sheet);
        }
        

        return sheet;
    };
    return async (onChange?: Function = (val) => val) =>
        await client
            .fetch({
                queryFunc: () => getSheet(sheetId),
                queryKey: `sheet-${sheetId}`,
                onChange: (data) => {
                    onChange(handler(data));
                },
            })
            .then((data) => handler(data));
};
