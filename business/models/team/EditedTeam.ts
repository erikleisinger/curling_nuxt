import { ValidationError } from "@/business/types/error/ValidationError";
type EditedAvatar = {
    path?: string;
    file?: File;
    url?: string;
}

export default class EditedTeam {
    id?: number;
    name?: string;
    rink?: object;
    avatar?: EditedAvatar;
    constructor({
        id = undefined,
        name = undefined,
        rink = undefined,
        avatar_url = undefined
    } : {
        id?: number, name?: string, rink?: object, avatar_url?: string
    } = {}) {
        this.id = id;
        this.name = name;
        this.rink = rink;
        this.avatar = {
            path: avatar_url,
            url: undefined,
            file: undefined
        };
    }


    toInsert() {
        const teamToInsert = {
            name: this.name,
            rink: this.rink?.id,
            avatar: this.avatar?.path
        };
        if (this.id) teamToInsert.id = this.id;
        return teamToInsert;
    }

    validateName() {
        return !!this.name || false

    }

    validateRink() {
        return !!this.rink || false
    }

    validate() {

        if (!this.validateName()) throw new ValidationError('Missing team name')
        if (!this.validateRink()) throw new ValidationError('Missing home rink')
        return true;
    }


}