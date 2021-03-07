export class CustomError extends Error {
    constructor( message ) {
        super( message );
        this.name = this.constructor.name;
        this.message = `${ this.name }: ${ this.message }`;
    }
}

export class ApiError extends CustomError {}

export class RequestError extends CustomError {
    constructor( message, statusCode = 500 ) {
        super( message );
        this.statusCode = statusCode;
    }
}

export class RequestDataError extends RequestError {
    constructor( method, message ) {
        super( `Method - ${ method }, reason - ${ message }`, 500 );
    }
}

export class RouterError extends RequestError {
    constructor( path ) {
        super( `There are no registered handlers for path "${ path }"`, 404 );
    }
}
