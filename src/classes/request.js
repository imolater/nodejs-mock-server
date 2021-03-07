import { URL }              from 'url';
import formidable           from 'formidable';
import { RequestDataError } from '~/classes/error';

export class Request {
    constructor( req ) {
        this.original = req;
        this.body = {};
        this.cookies = {};
        this.path = '';
    }

    /**
     * Расшифровка данных объекта запроса Node
     *
     * @return {Promise<void>}
     */
    async read() {
        const req = this.original;
        const contentType = req.headers['content-type'];
        const { path, params } = Request.readURL( req );

        this.path = path;
        this.cookies = Request.readCookie( req );

        if ( contentType && contentType.includes( 'multipart/form-data' ) ) {
            this.body = await Request.readFormData( req );
        } else if ( req.method === 'POST' ) {
            this.body = await Request.readPostData( req );
        } else {
            this.body = params;
        }
    }

    /**
     * Чтение GET-параметров объекта запроса Node
     *
     * @param req
     * @return {{}}
     */
    static readURL( req ) {
        try {
            const url = new URL( req.url, `http://${ req.headers.host }` );
            const { pathname: path } = url;
            const params = {};

            for ( const [ key, value ] of url.searchParams ) {
                params[key] = value;
            }

            return {
                path,
                params,
            };
        } catch ( e ) {
            throw new RequestDataError( 'GET', e.message );
        }
    }

    /**
     * Чтение данных формы объекта запроса Node
     *
     * @param req
     * @return {Promise<unknown>}
     */
    static readFormData( req ) {
        return new Promise( ( resolve, reject ) => {
            const form = new formidable.IncomingForm();

            form.parse( req, function( e, fields, files ) {
                if ( e ) {
                    reject( new RequestDataError( 'FormData', e.message ) );
                }

                resolve( { ...fields, ...files } );
            } );
        } );
    }

    /**
     * Чтение POST-данных объекта запроса Node
     *
     * @param req
     * @return {Promise<unknown>}
     */
    static readPostData( req ) {
        return new Promise( ( resolve, reject ) => {
            req.on( 'data', chunk => {
                try {
                    resolve( JSON.parse( chunk.toString() ) );
                } catch ( e ) {
                    reject( new RequestDataError( 'POST', e.message ) );
                }
            } );
        } );
    }

    /**
     * Чтение cookie объекта запроса Node
     *
     * @param req
     * @return {{}}
     */
    static readCookie( req ) {
        try {
            const rawCookies = ( req.headers.cookie || '' ).split( '; ' );
            const cookies = {};

            for ( const rawCookie of rawCookies ) {
                const [ key, value ] = rawCookie.split( '=' );
                cookies[key] = value;
            }

            return cookies;
        } catch ( e ) {
            throw new RequestDataError( 'Cookie', e.message );
        }
    }
}
