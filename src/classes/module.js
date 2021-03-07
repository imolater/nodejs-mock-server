export class Module {
    constructor( id, tables = [] ) {
        this.id = id;
        this.tables = tables;
    }

    async init() {}
}
