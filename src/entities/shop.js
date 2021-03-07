import { Location }         from '~/modules/location/classes/location';
import { InfoBlockElement } from '~/modules/infoblock/classes/info-block-element';

export class Shop extends InfoBlockElement {
    constructor( options = {} ) {
        super( options );

        let {
            location,
        } = options;

        if ( !location ) {
            location = Location.address();
        }

        Object.assign( this, { location } );
    }
}
