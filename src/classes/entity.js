import { Database }      from '~/classes/database';
import { transliterate } from 'transliteration';
import { MockData }      from '~/modules/mock-data/classes/mock-data';

export class Entity {
    static MODULE_ID;
    static TABLE_NAME;

    constructor( options = {} ) {
        const {
            id,
            title = MockData.title(),
            code = transliterate( title.toLowerCase().split( ' ' ).join( '-' ) ),
        } = options;

        Object.assign( this, {
            id,
            title,
            code,
        } );
    }

    static getItems( options = {} ) {
        const { MODULE_ID, TABLE_NAME } = this;
        return Database.read( MODULE_ID, TABLE_NAME, options );
    }

    static addItem( value ) {
        if ( !( value instanceof this ) ) {
            throw new TypeError( `Value should be an instance of ${ this }` );
        }

        const { MODULE_ID, TABLE_NAME } = this;
        const { items } = this.getItems( {
            filter:
                item => item.code.includes( value.code ) && item.depth === value.depth,
        } );

        if ( items.length ) {
            const length = items.length + 1;
            value.code += `-${ length }`;
            value.title += `-${ length }`;
        }

        return Database.create( MODULE_ID, TABLE_NAME, value );
    }
}
