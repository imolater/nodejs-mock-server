/**
 * Сортировка
 */
export function compare( a, b, options = {} ) {
    const {
        object = false,
        key = 'id',
        dir = 'asc',
    } = options;

    if ( object ) {
        a = a[key];
        b = b[key];
    }

    return ( dir === 'asc' )
        ? a > b ? 1 : ( a < b ) ? -1 : 0
        : a < b ? 1 : ( a > b ) ? -1 : 0;
}

/**
 * Логирование
 *
 * @param message
 */
export function log( message ) {
    console.log( message );
}

/**
 * Кодирует объект с данными в GET-параметры
 *
 * @param {object} data
 * @returns {string}
 */
export function encodeToUriParams( data = {} ) {
    let params = '';

    for ( const [ key, value ] of Object.entries( data ) ) {
        params += ( params === '' ) ? '?' : '&';
        params += key + '=' + encodeURIComponent( value );
    }

    return params;
}

/**
 * Кодирует объект с данными в cookie
 *
 * @param data
 * @return {string}
 */
export function encodeToCookieParams( data = {} ) {
    let params = '';

    for ( const [ key, value ] of Object.entries( data ) ) {
        params += ( params === '' ) ? '' : ';';
        params += key + '=' + value;
    }

    return params;
}
