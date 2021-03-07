import { Request }                from '~/classes/request';
import { Response }               from '~/classes/response';
import { Router }                 from '~/classes/router';
import { ApiError, RequestError } from '~/classes/error';
import { log }                    from '~/classes/utility';
import { Database }               from '~/classes/database';

export class App {
    init( modules ) {
        return Database.init( modules );
    }

    async handleRequest( req, res ) {
        const request = new Request( req );
        const response = new Response( res );

        try {
            await request.read();

            const method = Router.getMethod( request );
            method( request, response );
        } catch ( e ) {
            log( e.message );

            if ( e instanceof ApiError ) {
                // Ошибка обращения к API
                response.success( null, {}, true, e.message );
            } else if ( e instanceof RequestError ) {
                // Серверная ошибка
                response.error( e.statusCode );
            } else {
                // Ошибка запроса
                response.error( 400 );
            }
        }
    }
}
