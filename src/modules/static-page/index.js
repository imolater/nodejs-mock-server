import path                      from 'path';
import glob                      from 'glob';
import { Module }                from '~/classes/module';
import { MODULE_ID, TABLE_NAME } from '~/modules/static-page/constants';

class StaticPageModule extends Module {
    async init( options = {} ) {
        const {
            dir,
        } = options;

        glob( path.resolve( dir, '**', '*.js' ), {}, ( error, files ) => {
            if ( error ) {
                throw error;
            }

            const result = {};

            files.forEach( file => {
                const key = file.slice( dir.length, -3 ) + '/';
                result[key] = require( file );
            } );
        } );
    }
}

export const module = new StaticPageModule( MODULE_ID, [
    TABLE_NAME,
] );
