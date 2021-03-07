import { routes }      from '~/routes';
import { RouterError } from '~/classes/error';

function getMethod( req ) {
    const { path } = req;

    if ( path in routes ) {
        return routes[path];
    } else {
        throw new RouterError( path );
    }
}

export const Router = {
    getMethod,
};
