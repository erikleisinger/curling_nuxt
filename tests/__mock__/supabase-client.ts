class SelectReturnValue {
    fromArgs: string = "";
    mutationArgs: string | object = "";
    selectArgs: string = "";
    eqArgs: object = {};
    data: Array<T> = [];
    error: null = null;
    constructor(
        fromArgs: string,
        mutationArgs: string | object,
        selectArgs: string
    ) {
        this.fromArgs = fromArgs;
        this.mutationArgs = mutationArgs;
        this.selectArgs = selectArgs;
        const data = {
            fromArgs: this.fromArgs,
            mutationArgs: this.mutationArgs,
            selectArgs: this.selectArgs,
        };
        this.selectArgs.split(",").forEach((key) => {
            data[key] = "mockValue";
        });
      
        this.data = [data];
    }
    eq(key: string, value: string | number) {
        this.eqArgs = { key, value };
        return this;
    }
}
class MutationReturnValue {
    fromArgs: string = "";
    mutationArgs: string | object = "";
    selectArgs: string = "";
    constructor(fromArgs: string, mutationArgs: string | object) {
        this.fromArgs = fromArgs;
        this.mutationArgs = mutationArgs;
    }
    select(values: string) {
        this.selectArgs = values.replaceAll(" ", "").replaceAll("\n", "");

        return new SelectReturnValue(
            this.fromArgs,
            this.mutationArgs,
            this.selectArgs
        );
    }
}

class FromReturnValue {
    fromArgs: string = "";
    mutationArgs: string | object = "";
    constructor(fromArgs: string) {
        this.fromArgs = fromArgs;
    }
    insert(valueObj: object) {
        return new MutationReturnValue(this.fromArgs, valueObj);
    }
    update(valueObj: object) {
        return new MutationReturnValue(this.fromArgs, valueObj);
    }
}

class Client {
    from(tableName: string) {
        return new FromReturnValue(tableName);
    }
}

export const client = new Client();
