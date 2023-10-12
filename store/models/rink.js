import {Model } from "pinia-orm";

export default class Rink extends Model {
    static entity = "rinks";

    static fields() {
        return {
            id: this.number(),
            name: this.string("Unnamed rink"),
            province: this.string('')
        };
    }
}
