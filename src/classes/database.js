import { Module }  from '~/classes/module';
import { compare } from '~/classes/utility';

const path = require( 'path' );
const fs = require( 'fs' );
const config = {
    cache: {
        dir: '~/../.cache',
        name: 'db.json',
        get path() {
            return `${ this.dir }${ path.sep }${ this.name }`;
        },
    },
};
const database = {};

class Database {
    /**
     * Инициализация БД
     */
    async init( modules ) {
        const cache = this._getCache() || {};

        Object.assign( database, cache );

        for ( const module of modules ) {
            await this._registerModule( module );
        }
    }

    /**
     * Создание записи в БД
     *
     * @param moduleId
     * @param tableName
     * @param value
     * @return {number}
     */
    create( moduleId, tableName, value ) {
        const table = this._getTable( moduleId, tableName );

        if ( !Number.isInteger( value.id ) ) {
            const lastId = table.length ? table[table.length - 1].id : -1;
            value.id = lastId + 1;
        }

        table.push( Object.assign( {}, value ) );
        this._addCache();

        return value.id;
    }

    /**
     * Получение записи из БД
     *
     * @param moduleId
     * @param tableName
     * @param options
     * @return {{count: number, page: number, items: []}}
     */
    read( moduleId, tableName, options ) {
        const {
            page = 1,
            limit = 0,
            filter = item => item,
            select = item => item,
            sort = {},
        } = options;
        const table = this._getTable( moduleId, tableName );
        const result = {
            page,
            count: 0,
            items: [],
        };

        table.forEach( item => {
            if ( filter( item ) ) {
                result.items.push( select( item ) );
            }
        } );

        for ( const [ key, dir ] of Object.entries( sort ) ) {
            result.items.sort( ( a, b ) =>
                compare( a, b, {
                    object: true,
                    key,
                    dir,
                } ),
            );
        }

        const start = page > 1 ? ( ( page - 1 ) * limit ) : 0;
        const end = limit > 0 ? ( limit * page ) : undefined;

        result.count = result.items.length;
        result.items = result.items.slice( start, end );

        return result;
    }

    /**
     * Обновление записи в БД
     *
     * @param moduleId
     * @param tableName
     * @param id
     * @param update
     */
    update( moduleId, tableName, id, update ) {
        const [ result ] = this.read( moduleId, tableName, {
            filter: item => item.id === id,
        } );

        Object.assign( result, update );
        this._addCache();
    }

    /**
     * Удаление записи в БД
     *
     * @param moduleId
     * @param tableName
     * @param id
     */
    del( moduleId, tableName, id ) {
        const table = this._getTable( moduleId, tableName );
        const index = table.findIndex( item => item.id === id );

        table.splice( index, 1 );
        this._addCache();
    }

    _log( message ) {
        const className = this.constructor.name;
        console.log( `${ className }: ${ message }` );
    }

    /**
     * Регистрация данных модуля в БД
     */
    async _registerModule( options ) {
        const { module, data, clearCache = false } = options;

        if ( !( module instanceof Module ) ) {
            throw new TypeError(
                `Value should be an instance of '${ Module.constructor.name }'` );
        }

        const { id, tables } = module;

        if ( !clearCache && database[id] ) {
            this._log( `Module "${ id }" was taken from cache` );
        } else {
            this._addModule( id );
            tables.forEach( name => this._addTable( id, name ) );

            await module.init( data );

            this._log( `Module "${ id }" was generated` );
        }
    }

    /**
     * Добавление данных модуля в БД
     *
     * @param moduleId
     * @private
     */
    _addModule( moduleId ) {
        database[moduleId] = {};
        this._addCache();
    }

    /**
     * Получение данных модуля из БД
     *
     * @param moduleId
     * @private
     */
    _getModule( moduleId ) {
        return database[moduleId];
    }

    /**
     * Создание таблицы в БД
     *
     * @param moduleId
     * @param tableName
     * @private
     */
    _addTable( moduleId, tableName ) {
        const table = this._getTable( moduleId, tableName );
        const module = this._getModule( moduleId );

        if ( table ) {
            throw new Error( `Table '${ tableName }' already exist in module '${ moduleId }'` );
        }

        module[tableName] = [];
        this._addCache();
    }

    /**
     * Получение таблицы из БД
     *
     * @param moduleId
     * @param tableName
     * @return {*}
     * @private
     */
    _getTable( moduleId, tableName ) {
        const module = this._getModule( moduleId );

        if ( !module ) {
            throw new Error( `Module '${ moduleId }' is not installed` );
        }

        return module[tableName];
    }

    /**
     * Чтение БД из кэша
     *
     * @return {any}
     * @private
     */
    _getCache() {
        try {
            const { path } = config.cache;
            const json = fs.readFileSync( path, { encoding: 'utf-8' } );

            return JSON.parse( json );
        } catch ( e ) {
            return null;
        }
    }

    /**
     * Создание файла кэша БД
     *
     * @private
     */
    _addCache() {
        const { dir, path } = config.cache;
        const json = JSON.stringify( database );

        if ( !fs.existsSync( dir ) ) {
            fs.mkdirSync( dir );
        }

        if ( !fs.existsSync( path ) ) {
            fs.appendFileSync( path, json, { encoding: 'utf-8' } );
        } else {
            fs.writeFileSync( path, json, { encoding: 'utf-8' } );
        }
    }
}

const instance = new Database();

export { instance as Database };
