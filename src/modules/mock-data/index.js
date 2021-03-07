import { Module }   from '~/classes/module';
import { MockData } from '~/modules/mock-data/classes/mock-data';
import { Database } from '~/classes/database';
import { axios }    from '~/plugins/axios';
import {
    MODULE_ID,
    TABLE_NAME,
}                   from '~/modules/mock-data/constants';

class MockDataModule extends Module {
    static services = {
        randommer: {
            host: 'https://randommer.io/api/',
            headers: {
                'X-Api-Key': 'cabc96bbcb774bdea80ad3ba5bebe8f9',
            },
        },
        randomkey: {
            host: 'https://random.api.randomkey.io/v1/',
            headers: {
                auth: '3850145ad21aec1d4e5c4d84a86aa525',
            },
        },
        picsum: {
            host: 'https://picsum.photos/v2/',
            headers: {},
        },
        '1secmail': {
            host: 'https://www.1secmail.com/api/v1/',
            headers: {},
        },
        fishtext: {
            host: 'https://fish-text.ru/',
            headers: {},
        },
        imgflip: {
            host: 'https://api.imgflip.com/',
            headers: {},
        },
    };

    async init( options = {} ) {
        const {
            firstName = true,
            lastName = true,
            phone = true,
            email = true,
            text = true,
            image = true,
        } = options;

        if ( firstName ) {
            const response = await this._request( 'randommer', {
                method: 'GET',
                path: 'Name',
                params: {
                    nameType: 'firstname',
                    quantity: 1000,
                },
            } );

            this._addTable( new MockData( {
                title: 'Имена',
                code: 'firstName',
                items: response.data,
            } ) );
        }

        if ( lastName ) {
            const response = await this._request( 'randommer', {
                method: 'GET',
                path: 'Name',
                params: {
                    nameType: 'surname',
                    quantity: 1000,
                },
            } );

            this._addTable( new MockData( {
                title: 'Фамилии',
                code: 'lastName',
                items: response.data,
            } ) );
        }

        if ( phone ) {
            const response = await this._request( 'randommer', {
                method: 'GET',
                path: 'Phone/Generate',
                params: {
                    CountryCode: 'RU',
                    quantity: 1000,
                },
            } );

            this._addTable( new MockData( {
                title: 'Телефоны',
                code: 'phone',
                items: response.data,
            } ) );
        }

        if ( email ) {
            const response = await this._request( '1secmail', {
                method: 'GET',
                path: '',
                params: {
                    action: 'genRandomMailbox',
                    count: 1000,
                },
            } );

            this._addTable( new MockData( {
                title: 'Email',
                code: 'email',
                items: response.data,
            } ) );
        }

        if ( text ) {
            const response = await this._request( 'fishtext', {
                method: 'GET',
                path: 'get',
                params: {
                    type: 'sentence',
                    number: 500,
                },
            } );
            const sentences = response.data.text.split( '. ' );
            const words = [];

            this._addTable( new MockData( {
                title: 'Предложения',
                code: 'sentence',
                items: sentences,
            } ) );

            sentences.forEach( item => {
                const items = item.split( ' ' );

                items.forEach( item => {
                    const word = item.toLowerCase().replace( /[^а-я0-9]/gi, '' );

                    if ( word.length > 3 ) {
                        words.push( word );
                    }
                } );
            } );

            this._addTable( new MockData( {
                title: 'Слова',
                code: 'word',
                items: words,
            } ) );
        }

        if ( image ) {
            const response1 = await this._request( 'picsum', {
                method: 'GET',
                path: 'list',
                params: {
                    page: 1,
                    limit: 100,
                },
            } );
            const response2 = await this._request( 'imgflip', {
                method: 'GET',
                path: 'get_memes',
            } );

            this._addTable( new MockData( {
                title: 'Картинки',
                code: 'image',
                items: [
                    ...response1.data,
                    ...response2.data.data.memes,
                ],
            } ) );
        }
    }

    _request( service, options = {} ) {
        const { path, method, params, data } = options;
        const { host, headers } = MockDataModule.services[service];
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

export const module = new MockDataModule( MODULE_ID, [
    TABLE_NAME,
] );
