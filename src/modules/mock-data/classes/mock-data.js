import { MODULE_ID, TABLE_NAME } from '~/modules/mock-data/constants';
import { Random }                from '~/classes/random';
import { transliterate }         from 'transliteration';
import { Database }              from '~/classes/database';
import Color                     from 'color';

export class MockData {
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
            join = false,
            glue = ' ',
            select = item => item,
        } = options;

        const items = MockData._getTable( code );
        const min = nullable ? 0 : 1;
        const length = random ? Random.integer( min, count ) : count;
        const result = [];

        for ( let i = 0; i < length; i++ ) {
            result.push( select( Random.elem( items ) ) );
        }

        if ( result.length > 1 ) {
            return join
                ? result.join( glue )
                : result;
        } else if ( result.length === 1 ) {
            return result[0];
        } else {
            return nullValue;
        }
    }

    static firstName( options = {} ) {
        return MockData.get( 'firstName', 1, options );
    }

    static lastName( options = {} ) {
        return MockData.get( 'lastName', 1, options );
    }

    static fullName() {
        const firstName = MockData.get( 'firstName', 1 );
        const lastName = MockData.get( 'lastName', 1 );

        return `${ firstName } ${ lastName }`;
    }

    static phone( options = {} ) {
        return MockData.get( 'phone', 1, options );
    }

    static email( options = {} ) {
        return MockData.get( 'email', 1, options );
    }

    static word( options = {} ) {
        return MockData.get( 'word', 1, options );
    }

    static title( length = 4, options = {} ) {
        const {
            translit = false,
        } = options;

        const word = MockData.get( 'word', length, {
            ...options,
            random: true,
            join: true,
            glue: ' ',
        } );
        const title = word[0].toUpperCase() + word.slice( 1 );

        if ( translit ) {
            const code = transliterate( word.split( ' ' ).join( '-' ) );
            return [ title, code ];
        } else {
            return title;
        }
    }

    static sentence( options = {} ) {
        return MockData.get( 'sentence', 1, options );
    }

    static paragraph( length = 6, options = {} ) {
        return MockData.get( 'sentence', length, {
            ...options,
            random: true,
            join: true,
            glue: '. ',
        } );
    }

    static image( count = 1, options = {} ) {
        const {
            returnObject = false,
        } = options;

        if ( !returnObject ) {
            options.select = item => item.download_url || item.url;
        }

        return MockData.get( 'image', count, options );
    }

    static color( options = {} ) {
        const {
            nullable = false,
            nullValue = null,
            returnObject = false,
        } = options;

        if ( nullable && Random.boolean() ) {
            return nullValue;
        }

        const rgb = Array( 3 ).fill().map( () => Random.integer( 0, 255 ) );
        const color = Color.rgb( rgb );

        return returnObject ? color : color.hex();
    }

    static _getTable( code ) {
        const { items: [ result ] } = Database.read( MODULE_ID, TABLE_NAME, {
            filter: item => item.code === code,
        } );

        return result.items;
    }
}
