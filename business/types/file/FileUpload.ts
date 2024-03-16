import { MAX_AVATAR_SIZE_BYTES } from "@/business/constants/file/avatar";
import { ValidationError } from "@/business/types/error/ValidationError";
export class FileUpload {
    path: string;
    file: Blob;
    constructor(file: Blob) {
        const fileExt = file.name.split(".").pop();
        this.path = `${Math.random()}.${fileExt}`;
        this.file = file;
    }

    public validate() {
        if (this.file.size <= MAX_AVATAR_SIZE_BYTES) return true
        throw new ValidationError('Avatar is too large.')
    }
}