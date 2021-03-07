import { encodeToCookieParams } from '~/classes/utility';

export class Response {
    constructor( res, options = {} ) {
        const {
            headers = { 'Content-Type': 'text/html; charset=utf-8' },
            cookies = {},
        } = options;

        this.original = res;
        this.headers = headers;
        this.cookies = cookies;
    }

    /**
     * Завершение запроса с успехом
     *
     * @param result
     * @param options
     * @param isError
     * @param errorMessage
     */
    success( result = null, options = {}, isError = false, errorMessage = '' ) {
        const data = {
            error: +isError,
            errorMessage,
            result,
        };

        this.end( data, 200, options );
    }

    /**
     * Завершение запроса с ошибкой
     *
     * @param statusCode
     * @param options
     */
    error( statusCode, options = {} ) {
        this.end( null, statusCode, options );
    }

    /**
     * Завершение запроса настраиваемое
     *
     * @param data
     * @param statusCode
     * @param options
     */
    end( data = null, statusCode = 200, options = {} ) {
        const { headers = {}, cookies = {}, delay = 1500 } = options;

        setTimeout( () => {
            const res = this.original;

            res.writeHead( statusCode, {
                ...this.headers,
                ...headers,
                'Set-Cookie': encodeToCookieParams( {
                    ...this.cookies,
                    ...cookies,
                } ),
            } );
            res.end( JSON.stringify( data || '' ) );
        }, delay );
    }
}
