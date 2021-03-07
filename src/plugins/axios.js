import axios from 'axios';

const config = {
    baseURL: '',
    timeout: 60 * 1000,
    withCredentials: true,
};
const instance = axios.create( config );

instance.interceptors.request.use(
    function( config ) {
        return config;
    },
    function( e ) {
        // The request was canceled by client with axios cancelToken
        if ( axios.isCancel( e ) ) return;

        // The request was made but no response was received
        return Promise.reject( e );
    },
);

instance.interceptors.response.use(
    function( response ) {
        // The request was made and the server responded with a status code in the range of 2xx
        return response;
    },
    function( e ) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        return Promise.reject( e );
    },
);

export { instance as axios };
