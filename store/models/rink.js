import {Model } from "pinia-orm";
import Sheet from '@/store/models/sheet'

export default class Rink extends Model {
    static entity = "rinks";
    static fields() {
        return {
            id: this.number(),
            name: this.string("Unnamed rink"),
            province: this.string(''),
            city: this.string(''),
            sheets: this.hasMany(Sheet, 'rink_id'),
            sheet_count: this.number()
           
        };
    }
}
