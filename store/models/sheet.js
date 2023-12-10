import {Model } from "pinia-orm";

export default class Sheet extends Model {
    static entity = "sheets";

    static fields() {
        return {
            id: this.number(),
            number: this.attr("N/A"),
        };
    }
}
