import { Database }              from '~/classes/database';
import { MODULE_ID, TABLE_NAME } from '~/modules/location/constants';
import { Random }                from '~/classes/random';

export class Location {
    constructor( options ) {
        const {
            title,
            code,
            items = [],
        } = options;

        Object.assign( this, {
            title,
            code,
            items,
        } );
    }

    static get( code, count = 1, options = {} ) {
        const {
            nullable = false,
            nullValue = null,
            random = nullable,
            select = item => item,
        } = options;

        const items = Location._getTable( code );
        const min = nullable ? 0 : 1;
        const length = random ? Random.integer( min, count ) : count;
        const result = [];

        for ( let i = 0; i < length; i++ ) {
            result.push( select( Random.elem( items ) ) );
        }

        if ( result.length > 1 ) {
            return result;
        } else if ( result.length === 1 ) {
            return result[0];
        } else {
            return nullValue;
        }
    }

    static address( options = {} ) {
        return Location.get( 'address', 1, options );
    }

    static _getTable( code ) {
        const { items: [ result ] } = Database.read( MODULE_ID, TABLE_NAME, {
            filter: item => item.code === code,
        } );

        return result.items;
    }
}
