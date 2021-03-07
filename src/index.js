import http                           from 'http';
import { App }                        from '~/classes/app';
import { module as mockDataModule }   from '~/modules/mock-data';
import { module as locationModule }   from '~/modules/location';
import { module as infoBlockModule }  from '~/modules/infoblock';
import { log }                        from '~/classes/utility';
import { Shop }                       from '~/entities/shop';

const app = new App();

app.init( [
    { module: mockDataModule },
    { module: locationModule },
    {
        module: infoBlockModule,
        clearCache: false,
        data: [
            {
                title: 'Магазины',
                code: 'shops',
                sectionCount: 0,
                elementCount: 100,
                element: Shop,
            },
        ],
    },
] ).then( () => {
    const server = http.createServer( app.handleRequest );
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || 4000;

    server.listen( port, e => {
        if ( e ) {
            return console.log( `Server fall with uncaught error: ${ e.message }` );
        }

        console.log( `Server is listening on: http://${ host }:${ port }` );
    } );
} ).catch( e => {
    log( e.message );
} );
