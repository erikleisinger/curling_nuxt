import {Model } from "pinia-orm";
import Rink from '@/store/models/rink'
import { numberToLetter } from '@/utils/sheets'
export default class Sheet extends Model {
    static entity = "sheets";

    static fields() {
        return {
            id: this.number(),
            number: this.attr("N/A"),
            rink_id: this.number(),
            rink: this.belongsTo(Rink, 'rink_id')
        };
    }

    get letter() {
        return numberToLetter(this.number)
    }
}
