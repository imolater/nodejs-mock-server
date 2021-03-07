import { Module }   from '~/classes/module';
import { Database } from '~/classes/database';
import { axios }    from '~/plugins/axios';
import { Location } from '~/modules/location/classes/location';
import {
    MODULE_ID,
    TABLE_NAME,
}                   from '~/modules/location/constants';

class LocationModule extends Module {
    static services = {
        yandexMap: {
            host: 'https://search-maps.yandex.ru/v1/',
            apiKey: '741bd8b1-83f0-48bf-b9dd-d965d68e6ea5',
            headers: {
                Referer: 'https://yandex.ru/',
            },
        },
    };

    async init( options = {} ) {
        const {
            address = true,
        } = options;

        if ( address ) {
            try {
                const response = await this._request( 'yandexMap', {
                    method: 'GET',
                    params: {
                        apikey: LocationModule.services.yandexMap.apiKey,
                        text: 'Россия',
                        lang: 'ru_RU',
                        type: 'biz',
                        results: 500,
                    },
                } );

                const items = response.data.features.map( item => {
                    const coords = item.geometry.coordinates;
                    const {
                        name,
                        description: address,
                        CompanyMetaData,
                    } = item.properties;
                    const {
                        Hours = {},
                        Phones = [],
                    } = CompanyMetaData;
                    const hours = Hours.text || '';
                    const phones = Phones.map( item => item.formatted );

                    return {
                        name,
                        address,
                        coords,
                        hours,
                        phones,
                    };
                } );

                this._addTable( new Location( {
                    title: 'Адреса',
                    code: 'address',
                    items,
                } ) );
            } catch ( e ) {
                console.log( e );
            }
        }
    }

    _request( service, options = {} ) {
        const {
            path = '',
            method = 'GET',
            params = {},
            data = {},
        } = options;
        const { host, headers } = LocationModule.services[service];
        const url = `${ host }${ path }`;

        return axios( {
            url,
            method,
            params,
            data,
            headers,
        } );
    }

    _addTable( value ) {
        Database.create( MODULE_ID, TABLE_NAME, value );
    }
}

export const module = new LocationModule( MODULE_ID, [
    TABLE_NAME,
] );
