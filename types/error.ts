export enum ErrorName {
    RESOURCE_LOCKED = 'RESOURCE_LOCKED',
    DELETE_ERROR = 'DELETE_ERROR',
    INSERT_ERROR = 'INSERT_ERROR',
    SELECT_ERROR = 'SELECT_ERROR',
    UPDATE_ERROR = 'UPDATE_ERROR',
    VALIDATION_FAILED = 'VALIDATION_FAILED'
}

export class ValidationError extends Error {
    name: ErrorName
    message: string
    cause: any
    fatal: boolean = false
    constructor({
        name,
        message,
        cause,
        fatal
    }: {
        name: ErrorName;
        message: string;
        cause?: any;
        fatal: boolean;
    })  {
        super();
        this.name = name;
        this.message = message;
        this.cause = cause;
        this.fatal = fatal
    }
}

export class DatabaseError extends ValidationError {
    table: string
    constructor({
        table,
        ...rest
    }: {
        name: ErrorName;
        message: string;
        cause?: any;
        fatal: boolean;
        table: string;
    })  {
        super({...rest});
        this.table = table;

    }
}