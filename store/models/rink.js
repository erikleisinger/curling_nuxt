import {Model } from "pinia-orm";
import Team from '@/store/models/team'

export default class Rink extends Model {
    static entity = "rinks";
    static primaryKey = 'id';
    static fields() {
        return {
            id: this.number(),
            name: this.string("Unnamed rink"),
            province: this.string(''),
        };
    }
}
